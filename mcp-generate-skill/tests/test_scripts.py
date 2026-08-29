from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


probe = load_module("repo_probe", ROOT / "skills" / "mcpify" / "scripts" / "repo_probe.py")
validator = load_module("validate_manifest", ROOT / "skills" / "mcpify" / "scripts" / "validate_manifest.py")
publication = load_module("check_publication", ROOT / "skills" / "mcpify" / "scripts" / "check_publication.py")


class RepoProbeTests(unittest.TestCase):
    def test_detects_next_service_auth_and_env_name_without_value(self):
        app = ROOT / "tests" / "fixtures" / "next-app"
        report = probe.build_report(app)

        self.assertEqual(report["package_manager"], "pnpm")
        self.assertEqual(report["frameworks"], ["Next.js"])
        self.assertIn("PRIVATE_TEST_KEY", report["environment_variable_names"])
        self.assertNotIn("process.env", json.dumps(report))
        self.assertIn("src/services/orders.ts", report["path_signals"]["services"])
        self.assertIn("src/auth/policy.ts", report["path_signals"]["auth"])
        self.assertIn("src/app/api/orders/route.ts", report["path_signals"]["api_routes"])


class ManifestValidatorTests(unittest.TestCase):
    def test_schema_is_valid_json(self):
        schema_path = ROOT / "skills" / "mcpify" / "assets" / "mcp-manifest.schema.json"
        schema = json.loads(schema_path.read_text(encoding="utf-8"))
        self.assertEqual(schema["$schema"], "https://json-schema.org/draft/2020-12/schema")

    def test_semantic_rules_reject_unsafe_approved_tool(self):
        document = {
            "tools": [{
                "name": "execute_sql",
                "status": "approved",
                "source": {"operation": "executeSql"},
                "input_schema": {"type": "object", "additionalProperties": True},
                "access": {"authentication": "none", "scopes": []},
                "risk": {"level": "critical", "mutation": True},
                "confirmation": {"required": False, "mechanism": "none"},
                "idempotency": {"required": False, "strategy": "none"},
                "data": {"sensitivity": "secret"},
                "mcp": {"annotations": {"readOnlyHint": True}},
            }]
        }

        errors = validator.semantic_errors(document)

        combined = "\n".join(errors)
        self.assertIn("critical capabilities must be excluded", combined)
        self.assertIn("public capability cannot return sensitive data", combined)
        self.assertIn("generic execution primitive", combined)
        self.assertIn("reject unknown fields", combined)


class PublicationPreflightTests(unittest.TestCase):
    def test_valid_fixture_passes_offline_checks(self):
        fixture = ROOT / "tests" / "fixtures" / "publication"
        document = json.loads((fixture / "server.json").read_text(encoding="utf-8"))

        errors, warnings = publication.validate(document, fixture)

        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_rejects_private_remote_secret_default_and_version_drift(self):
        fixture = ROOT / "tests" / "fixtures" / "publication"
        document = json.loads((fixture / "server.json").read_text(encoding="utf-8"))
        document["version"] = "2.0.0"
        document["remotes"][0]["url"] = "http://localhost:3000/mcp"
        document["packages"][0]["environmentVariables"][0]["default"] = "secret-value"

        errors, _warnings = publication.validate(document, fixture)

        combined = "\n".join(errors)
        self.assertIn("must match top-level version", combined)
        self.assertIn("public HTTPS endpoint", combined)
        self.assertIn("must not contain default or value", combined)


if __name__ == "__main__":
    unittest.main()
