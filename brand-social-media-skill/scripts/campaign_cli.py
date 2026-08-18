#!/usr/bin/env python3
"""Command-line interface for deterministic campaign lifecycle operations."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from campaign_lib import (
    PLATFORMS,
    archive_campaign,
    backup_and_replace,
    build_manifest,
    count_characters,
    extract_urls,
    find_placeholders,
    initialise_campaign,
    load_constraints,
    load_context,
    save_validation_report,
    valid_url,
    validate_campaign,
)


def _csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Manage brand-social-skill campaigns")
    subparsers = parser.add_subparsers(dest="command", required=True)

    init = subparsers.add_parser("init", help="Initialise a collision-safe campaign directory")
    init.add_argument("--campaigns-root", type=Path, default=Path("campaigns"))
    init.add_argument("--title", required=True)
    init.add_argument("--objective", required=True)
    init.add_argument("--platforms", required=True, type=_csv, help=f"Comma-separated: {', '.join(PLATFORMS)}")
    init.add_argument("--brief", type=Path)
    init.add_argument("--slug")

    manifest = subparsers.add_parser("manifest", help="Rebuild the manifest and hashes")
    manifest.add_argument("campaign", type=Path)
    manifest.add_argument("--skill-root", type=Path, default=Path(__file__).resolve().parents[1])

    validate = subparsers.add_parser("validate", help="Validate and write review/validation-report.md")
    validate.add_argument("campaign", type=Path)
    validate.add_argument("--skill-root", type=Path, default=Path(__file__).resolve().parents[1])
    validate.add_argument("--stale-days", type=int, default=120)

    revise = subparsers.add_parser("revise", help="Back up a target and atomically replace its text")
    revise.add_argument("campaign", type=Path)
    revise.add_argument("--file", required=True, dest="relative_file")
    revise.add_argument("--replacement", type=Path, required=True)
    revise.add_argument("--reason", required=True)

    archive = subparsers.add_parser("archive", help="Create a non-destructive campaign ZIP")
    archive.add_argument("campaign", type=Path)
    archive.add_argument("--archive-root", type=Path, required=True)

    context = subparsers.add_parser("context", help="Load only selected context sections")
    context.add_argument("campaign", type=Path)
    context.add_argument("--sections", required=True, type=_csv)

    count = subparsers.add_parser("count", help="Count Unicode characters in a file")
    count.add_argument("file", type=Path)

    placeholders = subparsers.add_parser("placeholders", help="List unresolved placeholders")
    placeholders.add_argument("file", type=Path)

    links = subparsers.add_parser("check-links", help="Check URL syntax in one or more files")
    links.add_argument("files", nargs="+", type=Path)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        if args.command == "init":
            path = initialise_campaign(
                args.campaigns_root,
                args.title,
                args.objective,
                args.platforms,
                brief_path=args.brief,
                slug=args.slug,
            )
            print(path.resolve())
            return 0
        if args.command == "manifest":
            constraints = load_constraints(args.skill_root.resolve())
            manifest = build_manifest(args.campaign.resolve(), constraints)
            print(json.dumps(manifest, indent=2, ensure_ascii=False))
            return 0
        if args.command == "validate":
            campaign = args.campaign.resolve()
            constraints = load_constraints(args.skill_root.resolve())
            build_manifest(campaign, constraints)
            report = validate_campaign(campaign, constraints, stale_days=args.stale_days)
            path = save_validation_report(campaign, report)
            build_manifest(campaign, constraints)
            print(f"{report.status}: {len(report.errors)} error(s), {len(report.warnings)} warning(s); {path}")
            return 1 if report.errors else 0
        if args.command == "revise":
            backup = backup_and_replace(
                args.campaign.resolve(), args.relative_file, args.replacement.resolve(), args.reason
            )
            print(backup)
            return 0
        if args.command == "archive":
            print(archive_campaign(args.campaign.resolve(), args.archive_root.resolve()))
            return 0
        if args.command == "context":
            context = load_context(args.campaign.resolve(), args.sections)
            for section, text in context.items():
                print(f"--- {section} ---")
                print(text.rstrip())
            return 0
        if args.command == "count":
            text = args.file.read_text(encoding="utf-8")
            print(count_characters(text))
            return 0
        if args.command == "placeholders":
            values = find_placeholders(args.file.read_text(encoding="utf-8"))
            for value in values:
                print(value)
            return 1 if values else 0
        if args.command == "check-links":
            invalid: list[tuple[Path, str]] = []
            for path in args.files:
                for url in extract_urls(path.read_text(encoding="utf-8")):
                    if not valid_url(url):
                        invalid.append((path, url))
            for path, url in invalid:
                print(f"{path}: {url}")
            return 1 if invalid else 0
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
