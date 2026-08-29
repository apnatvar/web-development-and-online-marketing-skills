#!/usr/bin/env python3
"""Deterministically inventory MCP-relevant architecture signals without reading secrets."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Iterable

SKIP_DIRS = {
    ".agents", ".codex", ".git", ".next", ".nuxt", ".output", ".turbo", ".vercel", ".venv",
    "build", "coverage", "dist", "node_modules", "out", "target", "vendor",
    "mcp-analysis",
}
TEXT_SUFFIXES = {
    ".cjs", ".css", ".graphql", ".gql", ".js", ".jsx", ".json", ".mjs",
    ".prisma", ".py", ".rb", ".rs", ".sql", ".toml", ".ts", ".tsx", ".yaml", ".yml",
}
LANGUAGES = {
    ".ts": "TypeScript", ".tsx": "TypeScript", ".js": "JavaScript", ".jsx": "JavaScript",
    ".py": "Python", ".rb": "Ruby", ".rs": "Rust", ".go": "Go", ".java": "Java",
}
SIGNALS = {
    "api_routes": re.compile(r"(?:^|/)(?:app/.*/route|pages/api/|routes?/|controllers?/)", re.I),
    "server_actions": re.compile(r"(?:actions?|server-functions?)[^/]*\.(?:ts|tsx|js|jsx)$", re.I),
    "services": re.compile(r"(?:^|/)(?:services?|domain|use-cases?|usecases|dal|repositories?)(?:/|\.)", re.I),
    "auth": re.compile(r"(?:^|/)(?:auth|session|permissions?|polic(?:y|ies)|guards?|rbac|acl)(?:/|\.|-)", re.I),
    "database": re.compile(r"(?:^|/)(?:prisma|drizzle|database|db|models?|migrations?|repositories?)(?:/|\.|-)", re.I),
    "jobs_queues": re.compile(r"(?:^|/)(?:jobs?|queues?|workers?|cron|tasks?)(?:/|\.|-)", re.I),
    "storage": re.compile(r"(?:^|/)(?:storage|uploads?|files?|blobs?|s3)(?:/|\.|-)", re.I),
    "security_middleware": re.compile(r"(?:^|/)(?:middleware|proxy|rate-limit|ratelimit|security)(?:\.|/|-)", re.I),
}
CONTENT_SIGNALS = {
    "graphql": re.compile(r"\b(graphql|apollo|urql)\b", re.I),
    "trpc": re.compile(r"\b(?:@trpc|trpc)\b", re.I),
    "server_actions": re.compile(r"['\"]use server['\"]"),
    "payments": re.compile(r"\b(stripe|braintree|adyen|razorpay|paypal|paymentIntent)\b", re.I),
    "queues": re.compile(r"\b(bullmq|bull|inngest|trigger\.dev|sqs|rabbitmq|celery)\b", re.I),
    "object_storage": re.compile(r"\b(@aws-sdk/client-s3|cloudinary|uploadthing|supabase.storage|blob)\b", re.I),
    "destructive_or_privileged": re.compile(r"\b(delete|destroy|cancel|refund|publish|admin|impersonat|revoke|ban|role|permission)\w*\b", re.I),
}
ENV_PATTERN = re.compile(r"(?:process\.env\.([A-Z][A-Z0-9_]*)|process\.env\[['\"]([A-Z][A-Z0-9_]*)['\"]\]|os\.environ(?:\.get)?\(['\"]([A-Z][A-Z0-9_]*)['\"])")
MAX_FILE_BYTES = 1_000_000


def iter_files(root: Path) -> Iterable[Path]:
    for current, dirs, files in os.walk(root, followlinks=False):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS and not (Path(current) / d).is_symlink())
        for name in sorted(files):
            path = Path(current) / name
            if path.is_symlink():
                continue
            try:
                if path.stat().st_size <= MAX_FILE_BYTES:
                    yield path
            except OSError:
                continue


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def read_text(path: Path) -> str | None:
    if path.suffix.lower() not in TEXT_SUFFIXES and path.name not in {"Dockerfile", "Procfile"}:
        return None
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None


def package_data(root: Path) -> tuple[dict, set[str]]:
    package_file = root / "package.json"
    if not package_file.is_file():
        return {}, set()
    try:
        data = json.loads(package_file.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"parse_error": "package.json could not be parsed"}, set()
    deps = set(data.get("dependencies", {})) | set(data.get("devDependencies", {}))
    return {"name": data.get("name"), "scripts": sorted(data.get("scripts", {}))}, deps


def detect_frameworks(deps: set[str]) -> list[str]:
    mapping = {
        "next": "Next.js", "nuxt": "Nuxt", "@remix-run/react": "Remix", "astro": "Astro",
        "svelte": "Svelte/SvelteKit", "@sveltejs/kit": "SvelteKit", "express": "Express",
        "fastify": "Fastify", "hono": "Hono", "@nestjs/core": "NestJS",
    }
    return sorted({label for dep, label in mapping.items() if dep in deps})


def detect_package_manager(root: Path) -> str | None:
    for filename, manager in (("pnpm-lock.yaml", "pnpm"), ("yarn.lock", "yarn"), ("bun.lock", "bun"), ("bun.lockb", "bun"), ("package-lock.json", "npm")):
        if (root / filename).exists():
            return manager
    return None


def build_report(root: Path) -> dict:
    package, deps = package_data(root)
    languages: Counter[str] = Counter()
    paths: dict[str, list[str]] = {key: [] for key in SIGNALS}
    content: dict[str, list[str]] = {key: [] for key in CONTENT_SIGNALS}
    env_names: set[str] = set()
    manifests: list[str] = []

    for path in iter_files(root):
        relative = rel(path, root)
        language = LANGUAGES.get(path.suffix.lower())
        if language:
            languages[language] += 1
        if path.name in {"package.json", "pyproject.toml", "Cargo.toml", "go.mod", "Gemfile", "pom.xml", "build.gradle"}:
            manifests.append(relative)
        for key, pattern in SIGNALS.items():
            if pattern.search(relative):
                paths[key].append(relative)
        text = read_text(path)
        if text is None:
            continue
        for key, pattern in CONTENT_SIGNALS.items():
            if pattern.search(text):
                content[key].append(relative)
        for match in ENV_PATTERN.finditer(text):
            env_names.add(next(group for group in match.groups() if group))

    return {
        "probe_version": 1,
        "root": ".",
        "package_manager": detect_package_manager(root),
        "frameworks": detect_frameworks(deps),
        "languages_by_file_count": dict(sorted(languages.items())),
        "package": package,
        "manifests": sorted(manifests),
        "path_signals": {key: sorted(set(value)) for key, value in paths.items()},
        "content_signals": {key: sorted(set(value)) for key, value in content.items()},
        "environment_variable_names": sorted(env_names),
        "notes": [
            "Signals are search leads, not proof of capability or authorization.",
            "Environment values are never collected; only statically referenced names are listed.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="Repository root")
    parser.add_argument("--output", help="Write JSON to this path; defaults to stdout")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    if not root.is_dir():
        parser.error(f"not a directory: {root}")
    rendered = json.dumps(build_report(root), indent=2, sort_keys=True) + "\n"
    if args.output:
        output = Path(args.output)
        if not output.is_absolute():
            output = Path.cwd() / output
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8")
    else:
        sys.stdout.write(rendered)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
