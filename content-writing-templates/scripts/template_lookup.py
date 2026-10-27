#!/usr/bin/env python3
"""Search the bundled content template registry and return template guidance."""

from __future__ import annotations

import argparse
import json
import shlex
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = (ROOT / "assets" / "templates").resolve()
INDEX_PATH = ASSET_ROOT / "index.json"


class LookupError(ValueError):
    pass


def _load_index() -> list[dict[str, Any]]:
    try:
        data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise LookupError(f"Template index not found: {INDEX_PATH}") from exc
    except json.JSONDecodeError as exc:
        raise LookupError(f"Template index is invalid JSON: {exc}") from exc
    if data.get("schema_version") != 1 or not isinstance(data.get("templates"), list):
        raise LookupError("Template index must have schema_version 1 and a templates list")
    items = data["templates"]
    ids = [item.get("id") for item in items]
    if any(not isinstance(i, str) or not i for i in ids) or len(ids) != len(set(ids)):
        raise LookupError("Template index contains a missing or duplicate template ID")
    return items


def _load_template(item: dict[str, Any]) -> dict[str, Any]:
    relative = item.get("path")
    if not isinstance(relative, str) or not relative:
        raise LookupError(f"Template {item.get('id')} has no valid path")
    path = (ASSET_ROOT / relative).resolve()
    if not path.is_relative_to(ASSET_ROOT):
        raise LookupError(f"Template path escapes the template asset directory: {relative}")
    try:
        template = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise LookupError(f"Template file for {item['id']} not found: {relative}") from exc
    except json.JSONDecodeError as exc:
        raise LookupError(f"Template file for {item['id']} is invalid JSON: {exc}") from exc
    if template.get("id") != item["id"]:
        raise LookupError(f"Template ID mismatch in {relative}")
    return template


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="template_lookup.py", description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    listing = sub.add_parser("/templates", help="List matching templates")
    listing.add_argument("terms", nargs="*", help="Optional platform and objective")
    for flag in ("platform", "format", "objective", "tone", "framework", "length", "audience", "id"):
        listing.add_argument("--" + flag, action="append", dest=flag.replace("-", "_"))

    info = sub.add_parser("/template", help="Show one template")
    info.add_argument("id")
    info.add_argument("--info", action="store_true")

    write = sub.add_parser("/write", help="Return a selected template and writing instructions")
    write.add_argument("id", nargs="?")
    write.add_argument("--template", dest="template_id")
    write.add_argument("--topic")
    write.add_argument("--tone")
    write.add_argument("--mode", choices=("structure", "draft", "guided", "auto"), default="auto")

    recommend = sub.add_parser("/recommend", help="Recommend matching templates for a topic")
    recommend.add_argument("--topic")
    for flag in ("platform", "format", "objective", "tone", "framework", "length", "audience"):
        recommend.add_argument("--" + flag, action="append", dest=flag.replace("-", "_"))

    rewrite = sub.add_parser("/rewrite", help="Return instructions for rewriting with a template")
    rewrite.add_argument("--template", required=True, dest="template_id")
    rewrite.add_argument("--topic")
    rewrite.add_argument("--tone")
    rewrite.add_argument("--mode", choices=("structure", "draft", "guided", "auto"), default="auto")

    repurpose = sub.add_parser("/repurpose", help="Return source and target template guidance")
    repurpose.add_argument("--from", required=True, dest="source_id")
    repurpose.add_argument("--to", required=True, dest="target_id")
    repurpose.add_argument("--topic")

    compare = sub.add_parser("/compare", help="Compare two templates")
    compare.add_argument("ids", nargs=2)
    return parser


FILTER_FIELDS = {"platform": "platforms", "objective": "objectives", "tone": "tones",
                 "audience": "audiences"}


def _matches(item: dict[str, Any], filters: dict[str, list[str] | None]) -> bool:
    for key, values in filters.items():
        if not values:
            continue
        if key == "id":
            if any(value != item.get("id") for value in values):
                return False
            continue
        actual = item.get(FILTER_FIELDS.get(key, key), [])
        actual_values = actual if isinstance(actual, list) else [actual]
        if not all(any(str(value).casefold() == str(candidate).casefold() for candidate in actual_values)
                   for value in values):
            return False
    return True


def _find(items: list[dict[str, Any]], template_id: str) -> dict[str, Any]:
    for item in items:
        if item["id"] == template_id:
            return _load_template(item)
    raise LookupError(f"Unknown template ID '{template_id}'. Use /templates to list available IDs.")


def _print(obj: Any) -> None:
    print(json.dumps(obj, ensure_ascii=False, indent=2))


def run(argv: list[str]) -> int:
    if len(argv) == 1:
        try:
            argv = shlex.split(argv[0], posix=True)
        except ValueError as exc:
            print(f"Error: cannot parse command: {exc}", file=sys.stderr)
            return 2
    if argv and not argv[0].startswith("/"):
        argv[0] = "/" + argv[0]
    try:
        args = _parser().parse_args(argv)
        items = _load_index()
        if args.command == "/templates":
            if len(args.terms) > 2:
                raise LookupError("Use at most two positional terms: platform and objective.")
            # Positional shorthand: first term is platform, second is objective.
            filters = {k: getattr(args, k) for k in
                       ("platform", "format", "objective", "tone", "framework", "length", "audience", "id")}
            for key, term in zip(("platform", "objective"), args.terms):
                filters[key] = (filters[key] or []) + [term]
            found = [i for i in items if _matches(i, filters)]
            _print({"count": len(found), "templates": [
                {"id": i["id"], "name": i["name"], "objectives": i.get("objectives", []),
                 "use_cases": i.get("use_cases", [])} for i in found]})
            return 0
        if args.command == "/template":
            _print(_find(items, args.id))
            return 0
        if args.command == "/write":
            template_id = args.template_id or args.id
            if not template_id or (args.id and args.template_id and args.id != args.template_id):
                raise LookupError("Provide one template ID, either /write ID or /write --template ID.")
            template = _find(items, template_id)
            _print({"template": template, "parameters": {"topic": args.topic, "tone_override": args.tone,
                  "mode": args.mode}, "instruction_plan": _instruction_plan("write", args.mode, args.topic)})
            return 0
        if args.command == "/recommend":
            filters = {k: getattr(args, k) for k in
                       ("platform", "format", "objective", "tone", "framework", "length", "audience")}
            found = [i for i in items if _matches(i, filters)]
            # Topic is surfaced for the writing agent; registry matching is metadata-driven.
            _print({"topic": args.topic, "count": len(found), "templates": [
                {"id": i["id"], "name": i["name"], "objectives": i.get("objectives", []),
                 "use_cases": i.get("use_cases", [])} for i in found]})
            return 0
        if args.command == "/rewrite":
            _print({"template": _find(items, args.template_id), "parameters":
                    {"topic": args.topic, "tone_override": args.tone, "mode": args.mode},
                    "instruction_plan": _instruction_plan("rewrite", args.mode, args.topic)})
            return 0
        if args.command == "/repurpose":
            _print({"source_template": _find(items, args.source_id), "target_template": _find(items, args.target_id),
                    "topic": args.topic, "instruction_plan":
                    "Use the source text supplied in the conversation; retain its meaning and adapt it to the target structure."})
            return 0
        if args.command == "/compare":
            _print({"templates": [_find(items, template_id) for template_id in args.ids]})
            return 0
    except LookupError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2
    return 0


def _instruction_plan(action: str, mode: str, topic: str | None) -> str:
    subject = f"the topic '{topic}'" if topic else "the user's supplied topic or source text"
    mode_instruction = ("draft when all required inputs are available; otherwise provide a guided scaffold and ask "
                        "for missing required inputs" if mode == "auto" else f"follow mode={mode}")
    if action == "rewrite":
        return (f"Ask for the source text if it is not already present in the conversation. Rewrite {subject} "
                f"using the template structure; {mode_instruction} and respect any tone override.")
    return f"Apply the template to {subject}; {mode_instruction} and respect any tone override. The writing agent creates the prose."


if __name__ == "__main__":
    raise SystemExit(run(sys.argv[1:]))
