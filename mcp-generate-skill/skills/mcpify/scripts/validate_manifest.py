#!/usr/bin/env python3
"""Validate an MCPify YAML manifest structurally and semantically."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

GENERIC_OPERATIONS = re.compile(r"^(execute|run|call|invoke|query|mutate|update|delete)(sql|code|command|function|method|route|action|api|row|record)?$", re.I)
SENSITIVE = {"personal", "sensitive_personal", "financial", "health", "credential", "secret"}


def load_yaml(path: Path) -> Any:
    try:
        import yaml
    except ImportError as exc:
        raise RuntimeError("PyYAML is required; install scripts/requirements.txt") from exc
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def structural_errors(document: Any, schema_path: Path) -> list[str]:
    try:
        import jsonschema
    except ImportError:
        return ["warning: jsonschema is not installed; only semantic validation ran"]
    if not hasattr(jsonschema, "Draft202012Validator"):
        raise RuntimeError("jsonschema>=4.23 is required; install scripts/requirements.txt")
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(schema, format_checker=jsonschema.FormatChecker())
    errors = []
    for error in sorted(validator.iter_errors(document), key=lambda item: list(item.absolute_path)):
        location = ".".join(str(part) for part in error.absolute_path) or "$"
        errors.append(f"{location}: {error.message}")
    return errors


def semantic_errors(document: Any) -> list[str]:
    if not isinstance(document, dict):
        return ["$: manifest must be a mapping"]
    tools = document.get("tools")
    if not isinstance(tools, list):
        return ["tools: must be a list"]
    errors: list[str] = []
    names: set[str] = set()
    ordered_names: list[str] = []
    for index, tool in enumerate(tools):
        prefix = f"tools[{index}]"
        if not isinstance(tool, dict):
            errors.append(f"{prefix}: must be a mapping")
            continue
        name = tool.get("name")
        if isinstance(name, str):
            if name in names:
                errors.append(f"{prefix}.name: duplicate tool name {name!r}")
            names.add(name)
            ordered_names.append(name)
        risk = tool.get("risk", {}) if isinstance(tool.get("risk"), dict) else {}
        access = tool.get("access", {}) if isinstance(tool.get("access"), dict) else {}
        confirmation = tool.get("confirmation", {}) if isinstance(tool.get("confirmation"), dict) else {}
        idempotency = tool.get("idempotency", {}) if isinstance(tool.get("idempotency"), dict) else {}
        annotations = (tool.get("mcp", {}).get("annotations", {}) if isinstance(tool.get("mcp"), dict) else {})
        source = tool.get("source", {}) if isinstance(tool.get("source"), dict) else {}
        data = tool.get("data", {}) if isinstance(tool.get("data"), dict) else {}

        if risk.get("level") == "critical" and tool.get("status") != "excluded":
            errors.append(f"{prefix}: critical capabilities must be excluded")
        if risk.get("level") == "high" and tool.get("status") == "approved":
            if confirmation.get("required") is not True or confirmation.get("mechanism") in {None, "none"}:
                errors.append(f"{prefix}: approved high-risk capability requires bound confirmation")
        if risk.get("mutation") is True and risk.get("level") in {"high", "critical"} and idempotency.get("required") is not True:
            errors.append(f"{prefix}: high/critical mutations require idempotency or a state-precondition strategy")
        if access.get("authentication") in {"optional", "required"} and not access.get("scopes"):
            errors.append(f"{prefix}: authenticated capability requires at least one scope")
        if access.get("authentication") == "none" and data.get("sensitivity") in SENSITIVE:
            errors.append(f"{prefix}: public capability cannot return sensitive data")
        if risk.get("mutation") is True and annotations.get("readOnlyHint") is True:
            errors.append(f"{prefix}: mutation conflicts with readOnlyHint=true")
        if risk.get("mutation") is False and annotations.get("readOnlyHint") is not True:
            errors.append(f"{prefix}: read-only capability should declare readOnlyHint=true")
        operation = source.get("operation")
        if isinstance(operation, str) and GENERIC_OPERATIONS.fullmatch(operation.replace("_", "").replace("-", "")):
            errors.append(f"{prefix}.source.operation: generic execution primitive is not an agent capability")
        schema = tool.get("input_schema")
        if isinstance(schema, dict) and schema.get("type") == "object" and schema.get("additionalProperties") is not False:
            errors.append(f"{prefix}.input_schema: object inputs must reject unknown fields")

    if ordered_names != sorted(ordered_names):
        errors.append("tools: sort tools lexicographically by name for deterministic generation")
    for surface in ("resources", "prompts"):
        entries = document.get(surface, [])
        if not isinstance(entries, list):
            continue
        surface_names: list[str] = []
        seen_surface_names: set[str] = set()
        for index, entry in enumerate(entries):
            if not isinstance(entry, dict) or not isinstance(entry.get("name"), str):
                continue
            entry_name = entry["name"]
            if entry_name in seen_surface_names:
                errors.append(f"{surface}[{index}].name: duplicate {surface[:-1]} name {entry_name!r}")
            seen_surface_names.add(entry_name)
            surface_names.append(entry_name)
        if surface_names != sorted(surface_names):
            errors.append(f"{surface}: sort entries lexicographically by name for deterministic generation")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", help="Path to mcp-manifest.yaml")
    parser.add_argument("--schema", help="Override JSON Schema path")
    args = parser.parse_args()
    manifest_path = Path(args.manifest).resolve()
    schema_path = Path(args.schema).resolve() if args.schema else Path(__file__).resolve().parents[1] / "assets" / "mcp-manifest.schema.json"
    try:
        document = load_yaml(manifest_path)
        problems = structural_errors(document, schema_path) + semantic_errors(document)
    except (OSError, RuntimeError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    warnings = [item for item in problems if item.startswith("warning:")]
    errors = [item for item in problems if not item.startswith("warning:")]
    for warning in warnings:
        print(warning, file=sys.stderr)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"OK: {manifest_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
