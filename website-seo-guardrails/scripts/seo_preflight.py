#!/usr/bin/env python3
"""Conservative SEO preflight for a directory of rendered HTML files."""

from __future__ import annotations

import argparse
import json
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.in_title = False
        self.h1_count = 0
        self.canonicals: list[str] = []
        self.descriptions: list[str] = []
        self.robots: list[str] = []
        self.jsonld: list[str] = []
        self.in_jsonld = False
        self.jsonld_parts: list[str] = []
        self.links: list[str] = []
        self.images_missing_alt = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key.lower(): value for key, value in attrs}
        tag = tag.lower()
        if tag == "title":
            self.in_title = True
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "link" and (data.get("rel") or "").lower() == "canonical":
            if data.get("href"):
                self.canonicals.append(data["href"] or "")
        elif tag == "meta":
            name = (data.get("name") or "").lower()
            if name == "description":
                self.descriptions.append(data.get("content") or "")
            elif name in {"robots", "googlebot", "bingbot"}:
                self.robots.append((data.get("content") or "").lower())
        elif tag == "script" and (data.get("type") or "").lower() == "application/ld+json":
            self.in_jsonld = True
            self.jsonld_parts = []
        elif tag == "a" and data.get("href"):
            self.links.append(data["href"] or "")
        elif tag == "img" and "alt" not in data:
            self.images_missing_alt += 1

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title":
            self.in_title = False
        elif tag == "script" and self.in_jsonld:
            self.jsonld.append("".join(self.jsonld_parts).strip())
            self.in_jsonld = False
            self.jsonld_parts = []

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        if self.in_jsonld:
            self.jsonld_parts.append(data)

    @property
    def title(self) -> str:
        return " ".join("".join(self.title_parts).split())

    @property
    def noindex(self) -> bool:
        return any("noindex" in value for value in self.robots)


def page_url(root: Path, file: Path, origin: str) -> str:
    relative = file.relative_to(root).as_posix()
    if relative == "index.html":
        route = "/"
    elif relative.endswith("/index.html"):
        route = "/" + relative[: -len("index.html")]
    else:
        route = "/" + relative[: -len(".html")]
    return urljoin(origin.rstrip("/") + "/", route.lstrip("/"))


def load_sitemap(path: Path | None) -> set[str]:
    if not path or not path.is_file():
        return set()
    root = ET.parse(path).getroot()
    urls: set[str] = set()
    for element in root.iter():
        if element.tag.endswith("loc") and element.text:
            urls.add(element.text.strip())
    return urls


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path, help="Directory containing rendered HTML")
    parser.add_argument("--origin", required=True, help="Canonical HTTPS origin")
    parser.add_argument("--sitemap", type=Path, help="Optional sitemap.xml path")
    args = parser.parse_args()

    root = args.root.resolve()
    if not root.is_dir():
        parser.error(f"not a directory: {root}")
    origin = args.origin.rstrip("/")
    if urlparse(origin).scheme != "https" or not urlparse(origin).netloc:
        parser.error("--origin must be an HTTPS origin")

    files = sorted(root.rglob("*.html"))
    if not files:
        parser.error("no .html files found")
    sitemap_path = args.sitemap or root / "sitemap.xml"
    sitemap_urls = load_sitemap(sitemap_path)
    pages: dict[str, PageParser] = {}
    issues: list[tuple[str, str, str]] = []
    title_uses: dict[str, list[str]] = defaultdict(list)
    canonical_uses: dict[str, list[str]] = defaultdict(list)
    incoming: dict[str, int] = defaultdict(int)

    for file in files:
        url = page_url(root, file, origin)
        parsed = PageParser()
        parsed.feed(file.read_text(encoding="utf-8", errors="replace"))
        pages[url] = parsed
        if not parsed.title:
            issues.append(("ERROR", url, "missing title"))
        elif len(parsed.title) > 72:
            issues.append(("ERROR", url, f"title has {len(parsed.title)} characters (>72)"))
        elif len(parsed.title) > 60:
            issues.append(("WARN", url, f"title has {len(parsed.title)} characters (>60 preferred)"))
        else:
            title_uses[parsed.title].append(url)
        if len(parsed.descriptions) != 1:
            issues.append(("ERROR", url, f"expected one meta description, found {len(parsed.descriptions)}"))
        elif len(parsed.descriptions[0]) > 170:
            issues.append(("WARN", url, f"meta description has {len(parsed.descriptions[0])} characters"))
        if parsed.h1_count != 1:
            issues.append(("WARN", url, f"expected one clear H1, found {parsed.h1_count}"))
        if len(parsed.canonicals) != 1:
            issues.append(("ERROR", url, f"expected one canonical, found {len(parsed.canonicals)}"))
        else:
            canonical = urljoin(url, parsed.canonicals[0])
            canonical_uses[canonical].append(url)
            if not canonical.startswith(origin + "/") and canonical != origin:
                issues.append(("ERROR", url, f"canonical outside origin: {canonical}"))
        if parsed.noindex and url in sitemap_urls:
            issues.append(("ERROR", url, "noindex URL appears in sitemap"))
        if parsed.images_missing_alt:
            issues.append(("WARN", url, f"{parsed.images_missing_alt} image(s) missing alt attribute"))
        for index, block in enumerate(parsed.jsonld, 1):
            try:
                json.loads(block)
            except json.JSONDecodeError as error:
                issues.append(("ERROR", url, f"invalid JSON-LD block {index}: {error.msg}"))

    for source, parsed in pages.items():
        for href in parsed.links:
            target = urljoin(source, href).split("#", 1)[0]
            if target in pages:
                incoming[target] += 1
    for url, parsed in pages.items():
        if url != origin + "/" and not parsed.noindex and incoming[url] == 0:
            issues.append(("WARN", url, "indexable page has no discovered internal incoming link"))
    for title, urls in title_uses.items():
        if len(urls) > 1:
            for url in urls:
                issues.append(("ERROR", url, f"duplicate title: {title!r}"))
    for canonical, urls in canonical_uses.items():
        if len(urls) > 1:
            for url in urls:
                issues.append(("WARN", url, f"canonical shared by {len(urls)} rendered pages: {canonical}"))

    order = {"ERROR": 0, "WARN": 1}
    issues.sort(key=lambda item: (order[item[0]], item[1], item[2]))
    for severity, url, message in issues:
        print(f"{severity}\t{url}\t{message}")
    errors = sum(severity == "ERROR" for severity, _, _ in issues)
    warnings = len(issues) - errors
    print(f"Scanned {len(files)} page(s): {errors} error(s), {warnings} warning(s).")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
