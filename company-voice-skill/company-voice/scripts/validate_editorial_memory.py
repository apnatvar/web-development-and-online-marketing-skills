#!/usr/bin/env python3
"""Validate a company-voice editorial memory.

The checker is intentionally lightweight. It validates IDs, statuses, simple
frontmatter relationships, relation links, and directory indexes without
requiring external dependencies.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


ALLOWED_STATUSES = {"confirmed", "inferred", "provisional", "unresolved", "retired"}
RELATION_KEYS = {"depends_on", "affects", "overrides", "supersedes", "superseded_by"}
ID_RE = re.compile(r"^[a-z0-9]+(?:[.-][a-z0-9]+)*$")


def parse_frontmatter(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}

    end = text.find("\n---", 4)
    if end == -1:
        return {}

    raw = text[4:end].splitlines()
    data: dict[str, object] = {}
    current_key: str | None = None

    for line in raw:
        if not line.strip():
            continue
        if line.startswith("  - ") and current_key:
            value = data.setdefault(current_key, [])
            if isinstance(value, list):
                value.append(line[4:].strip().strip('"').strip("'"))
            continue
        if ":" in line:
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip()
            current_key = key
            if value == "[]":
                data[key] = []
            elif value:
                data[key] = value.strip('"').strip("'")
            else:
                data[key] = []

    return data


def collect_markdown(memory_root: Path) -> list[Path]:
    return sorted(path for path in memory_root.rglob("*.md") if path.is_file())


def collect_relation_targets(path: Path) -> list[tuple[int, str, str]]:
    if not path.exists():
        return []

    refs: list[tuple[int, str, str]] = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        stripped = line.strip()
        if stripped.startswith(("from:", "to:")):
            key, value = stripped.split(":", 1)
            refs.append((line_no, key, value.strip().strip('"').strip("'")))
    return refs


def as_list(value: object) -> list[str]:
    if isinstance(value, list):
        return [item for item in value if item]
    if isinstance(value, str) and value:
        return [value]
    return []


def validate(memory_root: Path) -> int:
    errors: list[str] = []
    warnings: list[str] = []

    if not memory_root.exists():
        errors.append(f"Memory root does not exist: {memory_root}")
        return report(errors, warnings, 0)

    root_index = memory_root / "00-index.md"
    if not root_index.exists():
        errors.append("Missing 00-index.md routing file")

    markdown_files = collect_markdown(memory_root)
    ids: dict[str, Path] = {}
    references: list[tuple[Path, str, str]] = []

    for path in markdown_files:
        meta = parse_frontmatter(path)
        decision_id = str(meta.get("id", "")).strip()

        if decision_id:
            if not ID_RE.match(decision_id):
                errors.append(f"{path}: invalid id '{decision_id}'")
            if decision_id in ids:
                errors.append(f"{path}: duplicate id '{decision_id}' also in {ids[decision_id]}")
            ids[decision_id] = path

        status = str(meta.get("status", "")).strip()
        if status and status not in ALLOWED_STATUSES:
            errors.append(f"{path}: invalid status '{status}'")

        for key in RELATION_KEYS:
            for ref in as_list(meta.get(key, [])):
                references.append((path, key, ref))

    for path, key, ref in references:
        if ref and ref not in ids:
            warnings.append(f"{path}: {key} references unknown id '{ref}'")

    relations = memory_root / "relations" / "links.yaml"
    for line_no, key, ref in collect_relation_targets(relations):
        if ref and ref not in ids:
            warnings.append(f"{relations}:{line_no}: {key} references unknown id '{ref}'")

    for directory in sorted(path for path in memory_root.iterdir() if path.is_dir()):
        if not (directory / "index.md").exists():
            warnings.append(f"{directory}: missing index.md")

    return report(errors, warnings, len(ids))


def report(errors: list[str], warnings: list[str], id_count: int) -> int:
    for message in errors:
        print(f"ERROR: {message}")
    for message in warnings:
        print(f"WARNING: {message}")

    if errors:
        print(f"Validation failed with {len(errors)} error(s), {len(warnings)} warning(s).")
        return 1

    print(f"Validation passed with {id_count} IDs and {len(warnings)} warning(s).")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a company-voice editorial memory.")
    parser.add_argument("memory_root", nargs="?", default=".editorial-voice")
    args = parser.parse_args()

    return validate(Path(args.memory_root).resolve())


if __name__ == "__main__":
    sys.exit(main())
