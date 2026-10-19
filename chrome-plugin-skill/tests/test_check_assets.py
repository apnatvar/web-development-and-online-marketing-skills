"""Offline tests for the Chrome Web Store asset checker."""

import contextlib
import importlib.util
import io
import json
import struct
import tempfile
import unittest
import zlib
from pathlib import Path

CHECKER_PATH = Path(__file__).resolve().parents[1] / "scripts" / "check_assets.py"
SPEC = importlib.util.spec_from_file_location("check_assets", CHECKER_PATH)
CHECKER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CHECKER)
main = CHECKER.main


def png(width: int, height: int, variant: int = 0) -> bytes:
    """Build a valid, tiny RGBA PNG with the requested dimensions."""
    def chunk(kind: bytes, payload: bytes) -> bytes:
        checksum = zlib.crc32(kind + payload) & 0xFFFFFFFF
        return struct.pack(">I", len(payload)) + kind + payload + struct.pack(">I", checksum)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    pixel = bytes((variant, 0, 0, 255))
    scanlines = b"".join(b"\0" + pixel * width for _ in range(height))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr)
            + chunk(b"IDAT", zlib.compress(scanlines)) + chunk(b"IEND", b""))


def jpeg_header(width: int, height: int) -> bytes:
    """Build the JPEG SOF header needed to identify image dimensions."""
    sof_payload = struct.pack(">BHHB", 8, height, width, 1) + b"\x01\x11\x00"
    return b"\xff\xd8\xff\xc0" + struct.pack(">H", len(sof_payload) + 2) + sof_payload


class CheckAssetsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.description = self.root / "description.txt"
        self.logo = self.root / "logo.png"
        self.shots = [self.root / "one.png", self.root / "two.png"]
        self.promo = self.root / "promo.png"
        self.urls = self.root / "urls.json"
        self.description.write_text("A valid listing description", encoding="utf-8")
        self.logo.write_bytes(png(128, 128))
        for index, shot in enumerate(self.shots):
            shot.write_bytes(png(640, 400, index))
        self.promo.write_bytes(png(440, 280))
        self.write_urls()

    def tearDown(self):
        self.temp.cleanup()

    def write_urls(self, **overrides):
        values = {"homepage": "https://example.test/",
                  "support": "https://example.test/support",
                  "privacy_policy": "https://example.test/privacy"}
        values.update(overrides)
        self.urls.write_text(json.dumps(values), encoding="utf-8")

    def invoke(self, *extra):
        args = ["--description", str(self.description), "--logo", str(self.logo),
                "--screenshots", *(str(path) for path in self.shots), "--promo", str(self.promo),
                "--urls", str(self.urls), *map(str, extra)]
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            status = main(args)
        return status, json.loads(output.getvalue())

    def test_valid_assets_pass_and_urls_are_marked_unverified(self):
        status, report = self.invoke()
        self.assertEqual(status, 0)
        self.assertEqual(report["status"], "ok")
        self.assertIn("not contacted or verified", report["urls_status"])
        self.assertEqual(report["logo"]["width"], 128)

    def test_128_pixel_jpeg_is_not_accepted_as_logo(self):
        self.logo.write_bytes(jpeg_header(128, 128))
        status, report = self.invoke()
        self.assertEqual(status, 1)
        self.assertTrue(any("logo must be PNG" in error for error in report["errors"]))

    def test_description_counts_emoji_as_two_utf16_units(self):
        self.description.write_text("😀", encoding="utf-8")
        status, report = self.invoke("--exact-characters", "2")
        self.assertEqual(status, 0)
        self.assertEqual(report["description"]["unicode_codepoints"], 1)
        self.assertEqual(report["description"]["utf16_code_units"], 2)

    def test_description_utf16_limit_and_exact_count(self):
        self.description.write_text("😀" * 8000, encoding="utf-8")
        status, report = self.invoke("--exact-characters", "15999")
        self.assertEqual(status, 1)
        self.assertEqual(report["description"]["utf16_code_units"], 16000)
        self.assertTrue(any("expected exactly 15999" in e for e in report["errors"]))
        status, report = self.invoke("--exact-characters", "16000")
        self.assertEqual(status, 0)

    def test_bad_screenshot_dimensions_and_count_are_reported(self):
        self.shots[0].write_bytes(png(1280, 720))
        status, report = self.invoke()
        self.assertEqual(status, 1)
        self.assertTrue(any("expected 640x400 or 1280x800" in e for e in report["errors"]))
        extras = self.shots + [self.root / f"extra{i}.png" for i in range(4)]
        for path in extras[2:]:
            path.write_bytes(png(640, 400))
        args = ["--description", str(self.description), "--logo", str(self.logo),
                "--screenshots", *(str(path) for path in extras), "--promo", str(self.promo),
                "--urls", str(self.urls)]
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(main(args), 1)

    def test_duplicate_screenshot_paths_and_contents_are_rejected(self):
        duplicate_path = self.root / "same-file.png"
        duplicate_path.write_bytes(png(640, 400))
        args = ["--description", str(self.description), "--logo", str(self.logo),
                "--screenshots", str(duplicate_path), str(duplicate_path),
                "--promo", str(self.promo), "--urls", str(self.urls)]
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            self.assertEqual(main(args), 1)
        self.assertIn("refer to the same file", output.getvalue())

        copy_path = self.root / "identical-copy.png"
        copy_path.write_bytes(duplicate_path.read_bytes())
        args[args.index(str(duplicate_path)) + 1] = str(copy_path)
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            self.assertEqual(main(args), 1)
        self.assertIn("identical content", output.getvalue())

    def test_exact_utf16_units_option_alias(self):
        self.description.write_text("😀", encoding="utf-8")
        status, report = self.invoke("--exact-utf16-units", "2")
        self.assertEqual(status, 0)
        status, report = self.invoke("--exact-characters", "2")
        self.assertEqual(status, 0)

    def test_missing_privacy_url_and_bad_url_fail(self):
        self.write_urls(support="http://example.test/support", privacy_policy=None)
        status, report = self.invoke()
        self.assertEqual(status, 1)
        errors = " ".join(report["errors"])
        self.assertIn("privacy_policy", errors)
        self.assertIn("support", errors)

    def test_promo_is_required_by_cli(self):
        args = ["--description", str(self.description), "--logo", str(self.logo),
                "--screenshots", *(str(path) for path in self.shots), "--urls", str(self.urls)]
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as raised:
            main(args)
        self.assertEqual(raised.exception.code, 2)


if __name__ == "__main__":
    unittest.main()
