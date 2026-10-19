import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "package_extension.py"


class PackageExtensionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.runtime = self.base / "release"
        self.runtime.mkdir()
        self._write("manifest.json", {
            "manifest_version": 3,
            "name": "Fixture",
            "version": "1.0",
            "action": {"default_popup": "popup.html", "default_icon": "icons/icon.png"},
            "background": {"service_worker": "scripts/worker.js"},
            "content_scripts": [{"matches": ["https://example.com/*"], "js": ["scripts/content.js"]}],
            "web_accessible_resources": [{"resources": ["assets/*.svg"], "matches": ["<all_urls>"]}],
        })
        self._write("popup.html", '<link rel="stylesheet" href="css/popup.css"><script src="./scripts/popup.js"></script><img src="icons/icon.png">')
        self._write("css/popup.css", 'body { background-image: url("../icons/icon.png"); } @import "nested/theme.css";')
        self._write("css/nested/theme.css", 'body { color: black; background-image: url("../fonts/font.woff2"); mask-image: url("data:image/svg+xml,%3Csvg/%3E"); }')
        self._write("css/fonts/font.woff2", b"font")
        self._write("scripts/worker.js", "// worker")
        self._write("scripts/content.js", "// content")
        self._write("scripts/popup.js", "// popup")
        self._write("icons/icon.png", b"png-bytes")
        self._write("assets/image.svg", "<svg/>")
        self._write("LICENSE", "license text")
        self._write("README.md", "marketing copy")

    def _write(self, name, content):
        path = self.runtime / name
        path.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(content, dict):
            path.write_text(json.dumps(content), encoding="utf-8")
        elif isinstance(content, bytes):
            path.write_bytes(content)
        else:
            path.write_text(content, encoding="utf-8")
        return path

    def _run(self, output, *includes, overwrite=False):
        command = [sys.executable, str(SCRIPT), "--runtime-dir", str(self.runtime), "--output", str(output)]
        for include in includes:
            command.extend(["--include", include])
        if overwrite:
            command.append("--overwrite")
        return subprocess.run(command, capture_output=True, text=True)

    def test_allowlist_manifest_dependencies_license_and_deterministic_zip(self):
        out_a, out_b = self.base / "a.zip", self.base / "b.zip"
        first = self._run(out_a, "popup.html", "scripts", "css", "icons", "assets", "LICENSE")
        second = self._run(out_b, "popup.html", "scripts", "css", "icons", "assets", "LICENSE")
        self.assertEqual(first.returncode, 0, first.stderr)
        self.assertEqual(second.returncode, 0, second.stderr)
        self.assertEqual(out_a.read_bytes(), out_b.read_bytes())
        with zipfile.ZipFile(out_a) as archive:
            names = archive.namelist()
            self.assertEqual(names, sorted(names))
            self.assertIn("manifest.json", names)
            self.assertIn("LICENSE", names)
            self.assertIn("css/nested/theme.css", names)
            self.assertNotIn("README.md", names)
        report = json.loads(first.stdout)
        self.assertEqual(report["file_count"], len(names))
        self.assertEqual(report["sha256"], hashlib.sha256(out_a.read_bytes()).hexdigest())

    def test_missing_dependency_fails_without_creating_archive(self):
        output = self.base / "missing.zip"
        result = self._run(output, "popup.html", "scripts", "icons", "assets")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("css/popup.css", result.stderr)
        self.assertFalse(output.exists())

    def test_manifest_resource_glob_must_match_included_file(self):
        output = self.base / "glob.zip"
        result = self._run(output, "popup.html", "scripts", "css", "icons")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("matches no included files", result.stderr)
        self.assertFalse(output.exists())

    def test_symlinked_include_is_rejected(self):
        link = self.runtime / "linked"
        try:
            link.symlink_to(self.runtime / "scripts", target_is_directory=True)
        except (OSError, NotImplementedError):
            self.skipTest("symlinks are unavailable")
        result = self._run(self.base / "link.zip", "linked")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("symlink", result.stderr)

    def test_traversal_selection_is_rejected(self):
        result = self._run(self.base / "traversal.zip", "../outside")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("unsafe include", result.stderr)

    def test_env_file_in_selected_directory_is_rejected(self):
        self._write("assets/.env.production", "SECRET=bad")
        result = self._run(self.base / "env.zip", "assets")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("forbidden", result.stderr)

    def test_output_inside_runtime_is_rejected(self):
        result = self._run(self.runtime / "package.zip", "scripts")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("outside the runtime", result.stderr)

    def test_existing_output_is_not_clobbered_without_overwrite(self):
        output = self.base / "existing.zip"
        output.write_bytes(b"keep me")
        result = self._run(output, "popup.html", "scripts", "css", "icons", "assets")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(output.read_bytes(), b"keep me")

    def test_local_script_query_and_parent_traversal_validation(self):
        output = self.base / "query.zip"
        self._write("popup.html", '<script src="scripts/popup.js?v=1"></script>')
        result = self._run(output, "popup.html", "scripts", "css", "icons", "assets")
        self.assertEqual(result.returncode, 0, result.stderr)
        self._write("popup.html", '<script src="../outside.js"></script>')
        result = self._run(self.base / "traversal-ref.zip", "popup.html", "scripts", "css", "icons", "assets")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("unsafe local reference", result.stderr)

    def test_remote_html_script_execution_is_rejected(self):
        self._write("popup.html", '<script src="https://bad.example/evil.js"></script>')
        result = self._run(self.base / "remote.zip", "popup.html", "scripts", "css", "icons", "assets")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("remote script execution", result.stderr)

    def test_data_and_javascript_script_sources_are_rejected(self):
        for index, source in enumerate(("data:text/javascript,alert(1)", "javascript:alert(1)")):
            with self.subTest(source=source):
                self._write("popup.html", f'<script src="{source}"></script>')
                result = self._run(self.base / f"nonlocal-script-{index}.zip", "popup.html", "scripts", "css", "icons", "assets")
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("remote script execution", result.stderr)

    def test_side_panel_default_path_must_be_included(self):
        manifest = json.loads((self.runtime / "manifest.json").read_text())
        manifest["side_panel"] = {"default_path": "sidepanel.html"}
        self._write("manifest.json", manifest)
        self._write("sidepanel.html", "<p>Side panel</p>")
        result = self._run(self.base / "sidepanel.zip", "popup.html", "scripts", "css", "icons", "assets")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("sidepanel.html", result.stderr)

    def test_declarative_net_request_rule_file_must_be_included(self):
        manifest = json.loads((self.runtime / "manifest.json").read_text())
        manifest["declarative_net_request"] = {
            "rule_resources": [{"id": "main", "enabled": True, "path": "rules/rules.json"}]
        }
        self._write("manifest.json", manifest)
        output = self.base / "missing-rules.zip"
        base_includes = ("popup.html", "scripts", "css", "icons", "assets")
        result = self._run(output, *base_includes)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("rules/rules.json", result.stderr)
        self.assertFalse(output.exists())

        self._write("rules/rules.json", '[{"id":1,"priority":1,"action":{"type":"block"},"condition":{"urlFilter":"example"}}]')
        result = self._run(self.base / "with-rules.zip", *base_includes, "rules/rules.json")
        self.assertEqual(result.returncode, 0, result.stderr)
        with zipfile.ZipFile(self.base / "with-rules.zip") as archive:
            self.assertIn("rules/rules.json", archive.namelist())

    def test_csp_remote_script_is_rejected_but_remote_permissions_are_allowed(self):
        manifest = json.loads((self.runtime / "manifest.json").read_text())
        manifest["host_permissions"] = ["https://api.example/*"]
        manifest["content_security_policy"] = {"extension_pages": "script-src 'self' https://evil.example"}
        self._write("manifest.json", manifest)
        result = self._run(self.base / "csp.zip", "popup.html", "scripts", "css", "icons", "assets")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("remote script execution", result.stderr)


if __name__ == "__main__":
    unittest.main()
