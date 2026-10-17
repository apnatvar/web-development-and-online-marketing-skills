#!/usr/bin/env python3
"""Package repository skills as distributable ZIP archives."""

from __future__ import annotations

import os
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parent.parent
DESTINATION = ROOT / "dist"
EXCLUDED_DIRS = {
    ".git",
    ".next",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".cache",
    "cache",
    "caches",
    "dist",
    "node_modules",
    "__pycache__",
    ".turbo",
}
NESTED_SKILLS = (
    "bd-public-skill/skills/business-diagnosis",
    "bd-public-skill/skills/implementation-brief",
    "bd-public-skill/skills/organic-growth-audit",
    "bd-public-skill/skills/workflow-improvement",
    "company-voice-skill/company-voice",
    "copy-marketing-skill/marketing-writing-skill",
    "mcp-generate-skill/skills/mcpify",
)


def files_under(folder: Path) -> list[Path]:
    """Return package files while excluding generated and dependency content."""
    paths: list[Path] = []
    for current, directories, filenames in os.walk(folder, topdown=True, followlinks=False):
        current_path = Path(current)
        directories[:] = sorted(
            name for name in directories
            if name not in EXCLUDED_DIRS
            and not (current_path / name).is_symlink()
        )
        for filename in filenames:
            path = current_path / filename
            if path.is_symlink() or path.suffix.lower() in {".pyc", ".zip"}:
                continue
            paths.append(path)
    return sorted(paths)


def write_archive(archive_path: Path, entries: list[tuple[Path, str]]) -> None:
    with ZipFile(archive_path, "w", compression=ZIP_DEFLATED) as archive:
        for source, archive_name in entries:
            archive.write(source, archive_name)


def main() -> None:
    root = ROOT.resolve()
    destination = DESTINATION.resolve()
    if destination == root or root not in destination.parents:
        raise RuntimeError(f"Archive destination must be inside repository: {destination}")

    top_level_skills = sorted(
        folder for folder in root.iterdir()
        if folder.is_dir() and (folder / "SKILL.md").is_file()
    )
    if not top_level_skills:
        raise RuntimeError(f"No top-level skill folders with SKILL.md found in {root}")

    nested = [(root / relative).resolve() for relative in NESTED_SKILLS]
    for folder in nested:
        if root not in folder.parents or not (folder / "SKILL.md").is_file():
            raise RuntimeError(f"Nested skill is missing or outside repository: {folder}")

    destination.mkdir(parents=True, exist_ok=True)
    for folder in top_level_skills:
        entries = [
            (path, path.relative_to(root).as_posix())
            for path in files_under(folder)
        ]
        write_archive(destination / f"{folder.name}.zip", entries)

    for folder in nested:
        relative = folder.relative_to(root)
        if relative.parts[0] == "bd-public-skill":
            # Keep ../../references links valid while packaging only the selected child.
            base = root / "bd-public-skill"
            # This child archive is a standalone skill package, not a partial plugin.
            paths = [root / "bd-public-skill/bd.png"]
            paths.extend(files_under(base / "references"))
            paths.extend(files_under(folder))
            entries = [
                (path, path.relative_to(root).as_posix())
                for path in sorted(set(paths))
                if path.is_file() and path.suffix.lower() not in {".pyc", ".zip"}
            ]
        else:
            entries = [
                (path, f"{folder.name}/{path.relative_to(folder).as_posix()}")
                for path in files_under(folder)
            ]
        write_archive(destination / f"{folder.name}.zip", entries)

    print(f"Wrote {len(top_level_skills)} top-level and {len(nested)} nested skill archives to {destination}")


if __name__ == "__main__":
    main()
