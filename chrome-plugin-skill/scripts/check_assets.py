#!/usr/bin/env python3
"""Check local Chrome Web Store listing assets without contacting any service."""

from __future__ import annotations

import argparse
import hashlib
import json
import struct
import sys
import zlib
from pathlib import Path
from urllib.parse import urlsplit


PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
SCREENSHOT_SIZES = {(1280, 800), (640, 400)}
URL_KEYS = ("homepage", "support", "privacy_policy")


def image_dimensions(path: Path) -> tuple[str, int, int]:
    """Read image format and dimensions from a structurally valid image header."""
    data = path.read_bytes()
    if data.startswith(PNG_SIGNATURE):
        if len(data) < 33 or data[12:16] != b"IHDR":
            raise ValueError("invalid PNG: missing complete IHDR chunk")
        length = struct.unpack(">I", data[8:12])[0]
        if length != 13:
            raise ValueError("invalid PNG: IHDR length must be 13")
        expected_crc = struct.unpack(">I", data[29:33])[0]
        actual_crc = zlib.crc32(data[12:29]) & 0xFFFFFFFF
        if expected_crc != actual_crc:
            raise ValueError("invalid PNG: IHDR checksum mismatch")
        width, height = struct.unpack(">II", data[16:24])
        if not width or not height:
            raise ValueError("invalid PNG: dimensions must be positive")
        return "PNG", width, height

    if data.startswith(b"\xff\xd8"):
        # Walk JPEG marker segments until a Start Of Frame marker provides dimensions.
        pos = 2
        sof_markers = {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                       0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}
        while pos < len(data):
            if data[pos] != 0xFF:
                raise ValueError("invalid JPEG: expected marker")
            while pos < len(data) and data[pos] == 0xFF:
                pos += 1
            if pos >= len(data):
                break
            marker = data[pos]
            pos += 1
            if marker in (0xD9, 0xDA):  # EOI or scan data before any SOF
                break
            if marker == 0x00 or marker in range(0xD0, 0xD8) or marker == 0x01:
                continue
            if pos + 2 > len(data):
                break
            segment_length = struct.unpack(">H", data[pos:pos + 2])[0]
            if segment_length < 2 or pos + segment_length > len(data):
                raise ValueError("invalid JPEG: truncated or malformed segment")
            if marker in sof_markers:
                if segment_length < 8:
                    raise ValueError("invalid JPEG: incomplete SOF segment")
                height, width = struct.unpack(">HH", data[pos + 3:pos + 7])
                if not width or not height:
                    raise ValueError("invalid JPEG: dimensions must be positive")
                return "JPEG", width, height
            pos += segment_length
        raise ValueError("invalid JPEG: no complete frame header found")

    raise ValueError("unsupported image: expected PNG or JPEG")


def check_image(path: Path, role: str, allowed_sizes: set[tuple[int, int]]) -> dict:
    fmt, width, height = image_dimensions(path)
    if (width, height) not in allowed_sizes:
        choices = " or ".join(f"{w}x{h}" for w, h in sorted(allowed_sizes))
        raise ValueError(f"{role} dimensions are {width}x{height}; expected {choices}")
    return {"file": path.name, "format": fmt, "width": width, "height": height}


def check_urls(path: Path) -> dict[str, str]:
    try:
        values = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read URLs JSON: {exc}") from exc
    if not isinstance(values, dict):
        raise ValueError("URLs JSON must be an object")
    errors = []
    for key in URL_KEYS:
        value = values.get(key)
        if not isinstance(value, str):
            errors.append(f"missing or non-string URL: {key}")
            continue
        try:
            parts = urlsplit(value)
            valid = (value == value.strip() and not any(ch.isspace() for ch in value)
                     and parts.scheme.lower() == "https" and bool(parts.hostname)
                     and parts.username is None and parts.password is None)
            _ = parts.port  # Force validation of malformed ports.
        except ValueError:
            valid = False
        if not valid:
            errors.append(f"{key} must be an HTTPS URL with a valid host and no credentials")
    if errors:
        raise ValueError("; ".join(errors))
    return {key: values[key] for key in URL_KEYS}


def read_description(path: Path) -> tuple[int, int]:
    try:
        with path.open("r", encoding="utf-8", newline="") as source:
            description = source.read()
    except (OSError, UnicodeError) as exc:
        raise ValueError(f"cannot read description as UTF-8: {exc}") from exc
    return len(description), len(description.encode("utf-16-le")) // 2


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--description", required=True, type=Path, help="UTF-8 description file")
    parser.add_argument("--logo", required=True, type=Path, help="128x128 PNG logo")
    parser.add_argument("--screenshots", required=True, nargs="+", type=Path,
                        help="2 to 5 screenshot files, each 1280x800 or 640x400")
    parser.add_argument("--expected-screenshots", type=int,
                        help="optionally require an exact screenshot count")
    parser.add_argument("--promo", required=True, type=Path,
                        help="440x280 PNG or JPEG promotional tile")
    parser.add_argument("--urls", required=True, type=Path,
                        help="JSON object with homepage, support, and privacy_policy HTTPS URLs")
    parser.add_argument("--exact-utf16-units", "--exact-characters", dest="exact_characters", type=int,
                        help="optionally require this exact Unicode UTF-16 code-unit count")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    errors: list[str] = []
    report: dict = {"status": "error"}

    try:
        codepoints, utf16_units = read_description(args.description)
        report["description"] = {"file": args.description.name,
                                 "unicode_codepoints": codepoints,
                                 "utf16_code_units": utf16_units}
        if not 1 <= utf16_units <= 16000:
            errors.append(f"description has {utf16_units} UTF-16 code units; expected 1..16000")
        if args.exact_characters is not None and utf16_units != args.exact_characters:
            errors.append(f"description has {utf16_units} UTF-16 code units; expected exactly {args.exact_characters}")
    except ValueError as exc:
        errors.append(f"description: {exc}")

    if args.expected_screenshots is not None and len(args.screenshots) != args.expected_screenshots:
        errors.append(f"received {len(args.screenshots)} screenshots; expected exactly {args.expected_screenshots}")
    if not 2 <= len(args.screenshots) <= 5:
        errors.append(f"received {len(args.screenshots)} screenshots; expected 2..5")
    report["screenshots"] = []
    screenshot_paths: dict[Path, str] = {}
    screenshot_hashes: dict[str, str] = {}
    for path in args.screenshots:
        try:
            report["screenshots"].append(check_image(path, "screenshot", SCREENSHOT_SIZES))
        except (OSError, ValueError) as exc:
            errors.append(f"screenshot {path.name}: {exc}")
        try:
            resolved = path.resolve(strict=True)
            prior_path = screenshot_paths.get(resolved)
            if prior_path is not None:
                errors.append(f"screenshots {prior_path} and {path.name} refer to the same file")
            else:
                screenshot_paths[resolved] = path.name
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            prior_hash = screenshot_hashes.get(digest)
            if prior_hash is not None:
                errors.append(f"screenshots {prior_hash} and {path.name} have identical content")
            else:
                screenshot_hashes[digest] = path.name
        except OSError:
            pass  # The image validation above reports the inaccessible or missing file.

    try:
        logo = check_image(args.logo, "logo", {(128, 128)})
        if logo["format"] != "PNG":
            raise ValueError("logo must be PNG")
        report["logo"] = logo
    except (OSError, ValueError) as exc:
        errors.append(f"logo {args.logo.name}: {exc}")
    try:
        report["promo"] = check_image(args.promo, "promo", {(440, 280)})
    except (OSError, ValueError) as exc:
        errors.append(f"promo {args.promo.name}: {exc}")
    try:
        report["urls"] = check_urls(args.urls)
        report["urls_status"] = "syntax checked locally; destinations not contacted or verified"
    except ValueError as exc:
        errors.append(f"URLs: {exc}")

    report["errors"] = errors
    if not errors:
        report["status"] = "ok"
    json.dump(report, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
