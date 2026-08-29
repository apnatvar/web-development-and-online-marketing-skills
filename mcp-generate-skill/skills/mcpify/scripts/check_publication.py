#!/usr/bin/env python3
"""Offline MCP server.json release preflight; the official publisher remains authoritative."""

from __future__ import annotations

import argparse
import ipaddress
import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

NAME_PATTERN = re.compile(r"^[a-z0-9]+(?:[.-][a-z0-9]+)*/[A-Za-z0-9_.-]+$")
RANGE_PATTERN = re.compile(r"(?:^|\s)(?:latest|[~^*]|[<>]=?|\d+\.x|\d+\.\*)(?:$|\s)", re.I)
SHA256_PATTERN = re.compile(r"^[0-9a-fA-F]{64}$")
PRIVATE_SUFFIXES = (".internal", ".local", ".localhost", ".test")


def is_public_https(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.hostname:
        return False
    host = parsed.hostname.lower()
    if host == "localhost" or host.endswith(PRIVATE_SUFFIXES):
        return False
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        return True
    return not (address.is_private or address.is_loopback or address.is_link_local or address.is_reserved)


def exact_version(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip()) and not RANGE_PATTERN.search(value.strip())


def check_secret_declaration(item: Any, location: str, errors: list[str]) -> None:
    if not isinstance(item, dict):
        errors.append(f"{location}: must be an object")
        return
    if item.get("isSecret") is True and ("default" in item or "value" in item):
        errors.append(f"{location}: secret declarations must not contain default or value")


def check_package_ownership(package: dict[str, Any], document: dict[str, Any], root: Path, index: int, errors: list[str], warnings: list[str]) -> None:
    kind = str(package.get("registryType", "")).lower()
    prefix = f"packages[{index}]"
    if kind in {"npm", "pypi", "nuget", "cargo"}:
        if not exact_version(package.get("version")):
            errors.append(f"{prefix}.version: an exact package version is required")
        elif package.get("version") != document.get("version"):
            errors.append(f"{prefix}.version: must match top-level version")
    if kind == "npm":
        package_json = root / "package.json"
        if package_json.is_file():
            try:
                package_data = json.loads(package_json.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                errors.append("package.json: cannot parse npm ownership metadata")
            else:
                if package_data.get("mcpName") != document.get("name"):
                    errors.append("package.json.mcpName: must match server.json name")
                if package_data.get("name") != package.get("identifier"):
                    errors.append("package.json.name: must match npm package identifier")
                if package_data.get("version") != package.get("version"):
                    errors.append("package.json.version: must match server.json package version")
        else:
            warnings.append("package.json: not found; npm ownership marker was not checked")
    elif kind == "pypi":
        readme = next((path for path in (root / "README.md", root / "README.rst") if path.is_file()), None)
        if readme:
            text = readme.read_text(encoding="utf-8", errors="replace")
            if f"mcp-name: {document.get('name')}" not in text:
                errors.append(f"{readme.name}: missing matching mcp-name ownership marker")
        else:
            warnings.append("README: not found; PyPI ownership marker was not checked")
    elif kind == "oci":
        identifier = package.get("identifier")
        if not isinstance(identifier, str) or ":" not in identifier.rsplit("/", 1)[-1]:
            errors.append(f"{prefix}.identifier: OCI identifier must include an immutable version tag or digest")
        warnings.append("OCI ownership annotation and image digest must be verified in the built image")
    elif kind == "mcpb":
        if not SHA256_PATTERN.fullmatch(str(package.get("fileSha256", ""))):
            errors.append(f"{prefix}.fileSha256: MCPB requires a 64-character SHA-256 digest")


def validate(document: Any, root: Path) -> tuple[list[str], list[str]]:
    if not isinstance(document, dict):
        return ["$: server.json must be an object"], []
    errors: list[str] = []
    warnings: list[str] = []
    schema = document.get("$schema")
    if not isinstance(schema, str) or not schema.startswith("https://static.modelcontextprotocol.io/schemas/"):
        errors.append("$schema: use the current official static.modelcontextprotocol.io server schema")
    name = document.get("name")
    if not isinstance(name, str) or not NAME_PATTERN.fullmatch(name):
        errors.append("name: use a namespace-qualified registry name such as io.github.owner/server")
    if not isinstance(document.get("description"), str) or not document["description"].strip():
        errors.append("description: a non-empty public description is required")
    if not exact_version(document.get("version")):
        errors.append("version: an exact non-latest version is required")
    packages = document.get("packages", [])
    remotes = document.get("remotes", [])
    if not packages and not remotes:
        errors.append("$: at least one tested package or remote is required")
    if packages is not None and not isinstance(packages, list):
        errors.append("packages: must be an array")
        packages = []
    if remotes is not None and not isinstance(remotes, list):
        errors.append("remotes: must be an array")
        remotes = []

    for index, package in enumerate(packages):
        if not isinstance(package, dict):
            errors.append(f"packages[{index}]: must be an object")
            continue
        if not package.get("registryType") or not package.get("identifier"):
            errors.append(f"packages[{index}]: registryType and identifier are required")
        transport = package.get("transport")
        if not isinstance(transport, dict) or not transport.get("type"):
            errors.append(f"packages[{index}].transport: type is required")
        for env_index, item in enumerate(package.get("environmentVariables", [])):
            check_secret_declaration(item, f"packages[{index}].environmentVariables[{env_index}]", errors)
        check_package_ownership(package, document, root, index, errors, warnings)

    seen_urls: set[str] = set()
    for index, remote in enumerate(remotes):
        prefix = f"remotes[{index}]"
        if not isinstance(remote, dict):
            errors.append(f"{prefix}: must be an object")
            continue
        url = remote.get("url")
        if not isinstance(url, str) or not is_public_https(url.replace("{", "x").replace("}", "x")):
            errors.append(f"{prefix}.url: remote must be a public HTTPS endpoint")
        elif url in seen_urls:
            errors.append(f"{prefix}.url: duplicate remote URL")
        else:
            seen_urls.add(url)
        transport_type = remote.get("type")
        if transport_type == "sse":
            warnings.append(f"{prefix}.type: SSE is deprecated for new servers; prefer streamable-http")
        elif transport_type != "streamable-http":
            errors.append(f"{prefix}.type: expected streamable-http")
        for variable_name, variable in (remote.get("variables") or {}).items():
            check_secret_declaration(variable, f"{prefix}.variables.{variable_name}", errors)
        for header_index, header in enumerate(remote.get("headers", [])):
            check_secret_declaration(header, f"{prefix}.headers[{header_index}]", errors)

    if document.get("status") is not None:
        errors.append("status: registry lifecycle status is registry-managed, not publisher metadata")
    official_meta = (document.get("_meta") or {}).get("io.modelcontextprotocol.registry/official") if isinstance(document.get("_meta"), dict) else None
    if official_meta is not None:
        errors.append("_meta.io.modelcontextprotocol.registry/official: registry-managed metadata must not be supplied")
    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("server_json", nargs="?", default="server.json")
    parser.add_argument("--root", help="Project/package root; defaults to server.json parent")
    args = parser.parse_args()
    path = Path(args.server_json).resolve()
    root = Path(args.root).resolve() if args.root else path.parent
    try:
        document = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    errors, warnings = validate(document, root)
    for warning in warnings:
        print(f"WARNING: {warning}", file=sys.stderr)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"OK: offline publication preflight passed for {path}")
    print("NEXT: run the current official `mcp-publisher validate` before publishing")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
