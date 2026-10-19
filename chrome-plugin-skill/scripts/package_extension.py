#!/usr/bin/env python3
"""Build a deterministic, allowlisted Chrome extension ZIP from a release directory.

This is a static dependency check, not a security audit. It checks selected files
and references visible in the MV3 manifest, HTML, and CSS. It cannot prove
completeness for dependencies loaded with ES module imports or importScripts,
loaded dynamically by JavaScript, generated at runtime, or named by computed paths.
"""

from __future__ import annotations

import argparse
import fnmatch
import hashlib
import html.parser
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import sys
import tempfile
from urllib.parse import unquote, urlsplit
import zipfile


FORBIDDEN_NAMES = {
    ".git", "node_modules", "tests", "test", "store-assets",
    "capture-source", ".openai", ".codex", ".agents", "__pycache__",
    ".cache", "cache", "coverage", "dist-src", "dev", "development",
}
FORBIDDEN_SUFFIXES = {
    ".map", ".pem", ".key", ".p12", ".pfx", ".crt", ".cer",
    ".sqlite", ".db", ".log", ".bak", ".tmp", ".zip", ".rar",
    ".7z", ".tar", ".gz",
}
FORBIDDEN_WORDS = ("credential", "secret", "private-key", "private_key", "privatekey")
REMOTE_SCHEMES = {"http", "https", "ftp", "file"}
CSS_URL = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.I | re.S)
CSS_IMPORT = re.compile(r"@import\s+(?:url\(\s*)?(['\"])(.*?)\1", re.I | re.S)


class PackageError(ValueError):
    """A packaging selection or dependency check failed."""


def _is_forbidden(relative: PurePosixPath) -> bool:
    for part in relative.parts:
        name = part.lower()
        if (name in FORBIDDEN_NAMES or name.startswith(".env")
                or name.endswith(tuple(FORBIDDEN_SUFFIXES))
                or any(word in name for word in FORBIDDEN_WORDS)):
            return True
    return False


def _safe_relative(raw: str) -> PurePosixPath:
    value = raw.replace("\\", "/")
    path = PurePosixPath(value)
    if not value or path.is_absolute() or re.match(r"^[A-Za-z]:", value):
        raise PackageError(f"include must be a non-empty relative path: {raw!r}")
    if any(part in ("", ".", "..") for part in value.split("/")):
        raise PackageError(f"unsafe include path: {raw!r}")
    if _is_forbidden(path):
        raise PackageError(f"forbidden file or directory in include: {raw}")
    return path


def _check_no_symlink(root: Path, path: Path) -> None:
    current = root
    for part in path.relative_to(root).parts:
        current = current / part
        if current.is_symlink():
            raise PackageError(f"symlink is not allowed: {current}")


def _collect(runtime: Path, includes: list[str]) -> dict[str, Path]:
    selected: dict[str, Path] = {}
    requests = ["manifest.json", *includes]
    for raw in requests:
        rel = _safe_relative(raw)
        source = runtime.joinpath(*rel.parts)
        _check_no_symlink(runtime, source)
        if not source.exists():
            raise PackageError(f"requested include does not exist: {raw}")
        if source.is_dir():
            for path in source.rglob("*"):
                _check_no_symlink(runtime, path)
                if path.is_dir():
                    continue
                child = PurePosixPath(path.relative_to(runtime).as_posix())
                if _is_forbidden(child):
                    raise PackageError(f"forbidden file in requested directory: {child}")
                if not path.is_file():
                    raise PackageError(f"unsupported file type: {child}")
                selected[child.as_posix()] = path
        elif source.is_file():
            selected[rel.as_posix()] = source
        else:
            raise PackageError(f"unsupported include type: {raw}")
    if "manifest.json" not in selected:
        raise PackageError("manifest.json is required at the runtime root")
    return dict(sorted(selected.items()))


def _local_reference(raw: str, owner: str, root_relative: bool) -> str | None:
    """Return a normalized local package path; None means an allowed non-local URL."""
    value = raw.strip()
    if not value or value.startswith("#"):
        return None
    parsed = urlsplit(value)
    # External CSS assets and HTML media are left to the browser; callers that
    # require a local file (manifest refs and script src) reject these schemes.
    if parsed.scheme or parsed.netloc:
        return None
    if "\\" in value or re.search(r"%(?:2f|5c)", parsed.path, re.I):
        raise PackageError(f"ambiguous separator in local reference in {owner}: {raw}")
    decoded = unquote(parsed.path)
    if not decoded:
        return None
    if "\x00" in decoded:
        raise PackageError(f"invalid local reference in {owner}: {raw}")
    parts = [] if decoded.startswith("/") or root_relative else list(PurePosixPath(owner).parent.parts)
    for part in decoded.lstrip("/").split("/"):
        if part in ("", "."):
            continue
        if part == "..":
            if not parts:
                raise PackageError(f"unsafe local reference in {owner}: {raw}")
            parts.pop()
        else:
            parts.append(part)
    if not parts:
        raise PackageError(f"local reference does not name a file in {owner}: {raw}")
    rel = PurePosixPath(*parts)
    if _is_forbidden(rel):
        raise PackageError(f"forbidden local reference in {owner}: {raw}")
    return rel.as_posix()


def _add_ref(refs: list[tuple[str, str]], raw: object, owner: str,
             root_relative: bool = True) -> None:
    if not isinstance(raw, str):
        raise PackageError(f"expected a path string in {owner}, got {raw!r}")
    parsed = urlsplit(raw.strip())
    if parsed.scheme or parsed.netloc:
        raise PackageError(f"manifest file reference must be local in {owner}: {raw}")
    local = _local_reference(raw, owner, root_relative)
    if local:
        refs.append((local, owner))


def _manifest_refs(manifest: dict, files: set[str]) -> list[tuple[str, str]]:
    refs: list[tuple[str, str]] = []
    for field in ("options_page", "devtools_page"):
        if field in manifest:
            _add_ref(refs, manifest[field], "manifest.json")
    for field in ("options_ui", "side_panel"):
        config = manifest.get(field, {})
        if isinstance(config, dict):
            page_field = "page" if field == "options_ui" else "default_path"
            if page_field in config:
                _add_ref(refs, config[page_field], "manifest.json")
    for override in manifest.get("chrome_url_overrides", {}).values() if isinstance(manifest.get("chrome_url_overrides", {}), dict) else ():
        _add_ref(refs, override, "manifest.json")
    for page in manifest.get("sandbox", {}).get("pages", []) if isinstance(manifest.get("sandbox", {}), dict) else ():
        _add_ref(refs, page, "manifest.json")
    for group in ("action", "browser_action", "page_action"):
        config = manifest.get(group, {})
        if isinstance(config, dict):
            for field in ("default_popup",):
                if field in config:
                    _add_ref(refs, config[field], "manifest.json")
            _icon_refs(refs, config.get("default_icon"), "manifest.json")
    _icon_refs(refs, manifest.get("icons"), "manifest.json")
    bg = manifest.get("background", {})
    if isinstance(bg, dict) and "service_worker" in bg:
        _add_ref(refs, bg["service_worker"], "manifest.json")
    for content in manifest.get("content_scripts", []):
        if not isinstance(content, dict):
            raise PackageError("manifest content_scripts entries must be objects")
        for field in ("js", "css"):
            for value in content.get(field, []):
                _add_ref(refs, value, "manifest.json")
    dnr = manifest.get("declarative_net_request", {})
    if isinstance(dnr, dict):
        for rule_resource in dnr.get("rule_resources", []):
            if not isinstance(rule_resource, dict):
                raise PackageError("manifest declarative_net_request.rule_resources entries must be objects")
            if "path" in rule_resource:
                _add_ref(refs, rule_resource["path"], "manifest.json")
    for resource_set in manifest.get("web_accessible_resources", []):
        if not isinstance(resource_set, dict):
            raise PackageError("manifest web_accessible_resources entries must be objects")
        for pattern in resource_set.get("resources", []):
            if not isinstance(pattern, str):
                raise PackageError("manifest web_accessible_resources resources must be strings")
            path = _local_reference(pattern, "manifest.json", True)
            if path is None:
                raise PackageError(f"invalid web accessible resource pattern: {pattern!r}")
            matches = [name for name in files if fnmatch.fnmatchcase(name, path)]
            if not matches:
                raise PackageError(f"web accessible resource pattern matches no included files: {pattern}")
    locale = manifest.get("default_locale")
    if locale:
        if not isinstance(locale, str) or "/" in locale or "\\" in locale or locale in (".", ".."):
            raise PackageError("manifest default_locale must be a locale name")
        refs.append((f"_locales/{locale}/messages.json", "manifest.json"))
    csp = manifest.get("content_security_policy")
    if isinstance(csp, str):
        _check_csp(csp)
    elif isinstance(csp, dict):
        for value in csp.values():
            if isinstance(value, str):
                _check_csp(value)
    return refs


def _icon_refs(refs: list[tuple[str, str]], icons: object, owner: str) -> None:
    if isinstance(icons, str):
        _add_ref(refs, icons, owner)
    elif isinstance(icons, dict):
        for path in icons.values():
            _add_ref(refs, path, owner)


def _check_csp(value: str) -> None:
    for directive in value.split(";"):
        words = directive.strip().split()
        if words and words[0].lower() == "script-src":
            if any(urlsplit(word.strip("'\"" )).scheme.lower() in REMOTE_SCHEMES
                   or word.strip("'\"").startswith("//") for word in words[1:]):
                raise PackageError("manifest CSP permits remote script execution")


class _HtmlRefs(html.parser.HTMLParser):
    def __init__(self, owner: str):
        super().__init__(convert_charrefs=True)
        self.owner = owner
        self.refs: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs)
        if tag.lower() == "script" and attrs.get("src"):
            src = attrs["src"] or ""
            parsed = urlsplit(src)
            if parsed.scheme or parsed.netloc or src.startswith("//"):
                raise PackageError(f"remote script execution in {self.owner}: {src}")
            self._add(src)
        elif tag.lower() == "link" and attrs.get("href"):
            rel = (attrs.get("rel") or "").lower().split()
            if "stylesheet" in rel:
                self._add(attrs["href"] or "")
        elif tag.lower() in {"img", "source", "audio", "video", "track", "iframe"}:
            for field in ("src", "poster"):
                if attrs.get(field):
                    self._add(attrs[field] or "")

    def _add(self, raw: str) -> None:
        local = _local_reference(raw, self.owner, False)
        if local:
            self.refs.append((local, self.owner))


def _css_refs(text: str, owner: str) -> list[tuple[str, str]]:
    refs = []
    for pattern in (CSS_URL, CSS_IMPORT):
        for match in pattern.finditer(text):
            raw = match.group(2).strip()
            local = _local_reference(raw, owner, False)
            if local:
                refs.append((local, owner))
    return refs


def _validate(files: dict[str, Path]) -> None:
    names = set(files)
    try:
        manifest = json.loads(files["manifest.json"].read_text(encoding="utf-8"))
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise PackageError(f"manifest.json is not valid UTF-8 JSON: {exc}") from exc
    if not isinstance(manifest, dict) or manifest.get("manifest_version") != 3:
        raise PackageError("manifest.json must be a Manifest V3 object")
    refs = _manifest_refs(manifest, names)
    for name, path in files.items():
        suffix = PurePosixPath(name).suffix.lower()
        if suffix == ".html":
            parser = _HtmlRefs(name)
            try:
                parser.feed(path.read_text(encoding="utf-8"))
            except UnicodeError as exc:
                raise PackageError(f"cannot parse HTML {name}: {exc}") from exc
            refs.extend(parser.refs)
        elif suffix == ".css":
            try:
                refs.extend(_css_refs(path.read_text(encoding="utf-8"), name))
            except UnicodeError as exc:
                raise PackageError(f"cannot read CSS {name}: {exc}") from exc
    for target, owner in refs:
        if target not in names:
            raise PackageError(f"{owner} references missing or unselected local file: {target}")


def build_archive(runtime_dir: Path, output: Path, includes: list[str], overwrite: bool = False) -> dict:
    runtime = runtime_dir.resolve(strict=True)
    if not runtime.is_dir():
        raise PackageError(f"runtime directory is not a directory: {runtime}")
    output_abs = output.resolve(strict=False)
    try:
        output_abs.relative_to(runtime)
    except ValueError:
        pass
    else:
        raise PackageError("output archive must be outside the runtime directory")
    if output_abs.exists() and not overwrite:
        raise PackageError(f"output already exists (use --overwrite): {output_abs}")
    files = _collect(runtime, includes)
    _validate(files)
    output_abs.parent.mkdir(parents=True, exist_ok=True)
    temp_path = None
    try:
        fd, temp_name = tempfile.mkstemp(prefix=f".{output_abs.name}.", suffix=".tmp", dir=output_abs.parent)
        os.close(fd)
        temp_path = Path(temp_name)
        with zipfile.ZipFile(temp_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for name, source in files.items():
                info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.create_system = 3
                info.external_attr = (stat.S_IFREG | 0o644) << 16
                archive.writestr(info, source.read_bytes())
        digest = hashlib.sha256(temp_path.read_bytes()).hexdigest()
        os.replace(temp_path, output_abs)
        temp_path = None
        return {"output": str(output_abs), "sha256": digest, "file_count": len(files), "files": list(files)}
    finally:
        if temp_path and temp_path.exists():
            temp_path.unlink()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--runtime-dir", required=True, type=Path, help="release build directory")
    parser.add_argument("--output", required=True, type=Path, help="ZIP destination (absolute or relative to current directory)")
    parser.add_argument("--include", action="append", default=[], metavar="PATH", help="additional file or directory, relative to runtime-dir; repeat as needed")
    parser.add_argument("--overwrite", action="store_true", help="replace an existing output ZIP atomically")
    args = parser.parse_args(argv)
    try:
        report = build_archive(args.runtime_dir, args.output, args.include, args.overwrite)
    except (PackageError, OSError, zipfile.BadZipFile) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(report, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
