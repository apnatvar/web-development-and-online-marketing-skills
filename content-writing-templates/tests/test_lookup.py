"""Contract checks for the template registry and command-line interface."""

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "templates"
INDEX = ASSETS / "index.json"
CLI = ROOT / "scripts" / "template_lookup.py"


class RegistryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index = json.loads(INDEX.read_text(encoding="utf-8"))
        cls.entries = cls.index["templates"]

    def test_registry_ids_are_unique_and_every_template_loads(self):
        ids = [entry["id"] for entry in self.entries]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertTrue(ids)
        for entry in self.entries:
            path = (ASSETS / entry["path"]).resolve()
            self.assertTrue(path.is_relative_to(ASSETS.resolve()), entry["path"])
            self.assertTrue(path.is_file(), entry["path"])
            template = json.loads(path.read_text(encoding="utf-8"))
            self.assertEqual(template["id"], entry["id"])
        disk_files = {path.name for path in ASSETS.glob("*.json")} - {"index.json"}
        self.assertEqual(disk_files, {entry["path"] for entry in self.entries})

    def test_registry_metadata_and_all_placeholders_are_documented(self):
        metadata = ("id", "name", "description", "platforms", "format", "objectives", "tones",
                    "use_cases", "framework", "length", "audiences", "path")
        for entry in self.entries:
            for key in metadata:
                self.assertIn(key, entry, f"{entry.get('id')}: {key}")
            template = json.loads((ASSETS / entry["path"]).read_text(encoding="utf-8"))
            for key in metadata[:-1]:
                self.assertEqual(template.get(key), entry[key], f"{entry['id']}: metadata mismatch for {key}")
            for key in ("required_inputs", "optional_inputs"):
                self.assertIsInstance(template.get(key), dict, f"{entry['id']}: {key}")
                self.assertTrue(all(isinstance(k, str) and isinstance(v, str) and v.strip()
                                    for k, v in template[key].items()), entry["id"])
            for key in ("structure", "customization", "limitations"):
                self.assertIn(key, template, f"{entry['id']}: {key}")
            placeholders = set(re.findall(r"\[([A-Z][A-Z0-9_]*)\]", template["structure"]))
            documented = set(template["required_inputs"]) | set(template["optional_inputs"])
            self.assertLessEqual(set(template["required_inputs"]), placeholders, f"{entry['id']}: unused required inputs")
            self.assertLessEqual(placeholders, documented, f"{entry['id']}: undocumented placeholders")
            serialized = json.dumps(template, ensure_ascii=False).casefold()
            self.assertNotIn("brownsmith", serialized, entry["id"])


class CommandTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.entries = json.loads(INDEX.read_text(encoding="utf-8"))["templates"]
        if not cls.entries:
            raise AssertionError("Registry must contain at least one template")
        cls.first = cls.entries[0]

    def invoke(self, command):
        return subprocess.run([sys.executable, str(CLI), command], cwd=ROOT,
                              text=True, capture_output=True, check=False)

    def test_all_command_patterns_smoke(self):
        tid = self.first["id"]
        second = self.entries[1]["id"] if len(self.entries) > 1 else tid
        commands = [
            "/templates",
            f"/templates {self.first['platforms'][0]} {self.first['objectives'][0]}",
            f"/templates --platform {self.first['platforms'][0]} --objective {self.first['objectives'][0]}",
            f"/template {tid}",
            f"/template {tid} --info",
            f'/write --template {tid} --topic "a topic with spaces" --tone concise --mode draft',
            f'/write {tid} --topic "quoted topic stays intact"',
            f'/recommend --topic "a topic with spaces" --platform {self.first["platforms"][0]}',
            "/recommend --platform linkedin --objective educational",
            "/templates --objective promotional --tone witty",
            f"/rewrite --template {tid}",
            f"/repurpose --from {tid} --to {second}",
            f"/compare {tid} {second}",
        ]
        for command in commands:
            with self.subTest(command=command):
                result = self.invoke(command)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertTrue(result.stdout.strip())
        write = json.loads(self.invoke(f'/write {tid} --topic "quoted topic stays intact"').stdout)
        self.assertEqual(write["parameters"]["topic"], "quoted topic stays intact")
        self.assertEqual(write["parameters"]["mode"], "auto")

    def test_filters_return_the_actual_matching_ids(self):
        expected = {e["id"] for e in self.entries
                    if "linkedin" in e["platforms"] and "educational" in e["objectives"]}
        result = self.invoke("/templates --platform linkedin --objective educational")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual({e["id"] for e in json.loads(result.stdout)["templates"]}, expected)
        expected = {e["id"] for e in self.entries
                    if "promotional" in e["objectives"] and "witty" in e["tones"]}
        result = self.invoke("/templates --objective promotional --tone witty")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual({e["id"] for e in json.loads(result.stdout)["templates"]}, expected)

    def test_every_registered_id_resolves_through_cli(self):
        for entry in self.entries:
            with self.subTest(template_id=entry["id"]):
                result = self.invoke(f"/template {entry['id']}")
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(json.loads(result.stdout)["id"], entry["id"])

    def test_unknown_ids_and_flags_return_helpful_nonzero_errors(self):
        for command, expected in (("/template does-not-exist", "Unknown template ID"),
                                  ("/write --template missing", "Unknown template ID"),
                                  ("/templates linkedin educational extra", "at most two positional terms"),
                                  ("/templates --not-a-filter", "unrecognized arguments")):
            with self.subTest(command=command):
                result = self.invoke(command)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn(expected, result.stderr)

    def test_empty_filter_result_is_valid(self):
        result = self.invoke("/templates --id definitely-not-a-template")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["count"], 0)


if __name__ == "__main__":
    unittest.main()
