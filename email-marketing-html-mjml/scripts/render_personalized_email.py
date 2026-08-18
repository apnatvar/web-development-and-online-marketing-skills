#!/usr/bin/env python3
"""Safely render simple {{token}} placeholders in compiled email HTML.

This preview/export helper never sends email and intentionally does not implement
conditionals or raw HTML injection. Use the ESP's template engine for advanced logic.
"""

from __future__ import annotations

import argparse
import csv
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

TOKEN = re.compile(r"\{\{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\}\}")
URL_TOKENS = {"campaign_url", "unsubscribe_url", "preferences_url", "tracking_url", "order_url"}


def validate_url(name: str, value: str) -> str:
    parsed = urlparse(value)
    if parsed.scheme != "https" or not parsed.netloc or parsed.username or parsed.password:
        raise ValueError(f"{name} must be an absolute HTTPS URL without credentials")
    if any(ord(character) < 32 for character in value):
        raise ValueError(f"{name} contains a control character")
    return value


def render(template: str, record: dict[str, object], defaults: dict[str, object], strict: bool) -> str:
    values = {**defaults, **record}

    def replace(match: re.Match[str]) -> str:
        name = match.group(1)
        raw = values.get(name)
        if raw is None or str(raw).strip() == "":
            if strict:
                raise ValueError(f"missing value for {name}")
            return match.group(0)
        value = str(raw)
        if name in URL_TOKENS:
            validate_url(name, value)
        return html.escape(value, quote=True)

    return TOKEN.sub(replace, template)


def records_from(path: Path) -> list[dict[str, object]]:
    if path.suffix.lower() == ".json":
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            return [data]
        if isinstance(data, list) and all(isinstance(item, dict) for item in data):
            return data
        raise ValueError("JSON must be an object or an array of objects")
    if path.suffix.lower() == ".csv":
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            return list(csv.DictReader(handle))
    raise ValueError("data file must be .json or .csv")


def safe_name(record: dict[str, object], index: int) -> str:
    candidate = str(record.get("recipient_id") or record.get("email") or index)
    cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "-", candidate).strip(".-")
    return cleaned or str(index)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("template", type=Path, help="Compiled HTML containing {{tokens}}")
    parser.add_argument("data", type=Path, help="JSON object/list or CSV rows")
    parser.add_argument("--output", type=Path, required=True, help="Output directory")
    parser.add_argument("--defaults", type=Path, help="Optional JSON object with fallback values")
    parser.add_argument("--strict", action="store_true", help="Fail when any token is unresolved")
    args = parser.parse_args()

    template = args.template.read_text(encoding="utf-8")
    records = records_from(args.data)
    defaults: dict[str, object] = {}
    if args.defaults:
        loaded = json.loads(args.defaults.read_text(encoding="utf-8"))
        if not isinstance(loaded, dict):
            parser.error("--defaults must contain a JSON object")
        defaults = loaded

    args.output.mkdir(parents=True, exist_ok=True)
    names: set[str] = set()
    for index, record in enumerate(records, 1):
        name = safe_name(record, index)
        if name in names:
            name = f"{name}-{index}"
        names.add(name)
        result = render(template, record, defaults, args.strict)
        (args.output / f"{name}.html").write_text(result, encoding="utf-8")
    print(f"Rendered {len(records)} personalized HTML file(s) to {args.output}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        sys.exit(1)
