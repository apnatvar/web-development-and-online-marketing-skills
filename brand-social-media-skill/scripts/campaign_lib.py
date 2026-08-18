#!/usr/bin/env python3
"""Standard-library campaign storage, revision, manifest, and validation helpers."""

from __future__ import annotations

import hashlib
import html.parser
import json
import re
import shutil
import unicodedata
import urllib.parse
import uuid
import zipfile
from dataclasses import dataclass, field
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Iterable, Sequence

SKILL_VERSION = "1.0.0"
PLATFORMS = (
    "linkedin",
    "facebook",
    "reddit",
    "instagram",
    "x",
    "threads",
    "medium",
    "dm",
    "email",
    "newsletter",
)
CONTEXT_SECTIONS = ("campaign", "brand", "product", "audience", "offer", "sources")
REQUIRED_CAMPAIGN_FILES = (
    "README.md",
    "manifest.json",
    "context/campaign.md",
    "context/brand.md",
    "context/product.md",
    "context/audience.md",
    "context/offer.md",
    "context/sources.md",
    "strategy/campaign-strategy.md",
    "strategy/messaging-pillars.md",
    "strategy/content-map.md",
    "strategy/publishing-sequence.md",
    "strategy/assumptions.md",
    "review/revision-log.md",
)
MINIMUM_PLATFORM_FILES = {
    "linkedin": ("linkedin/post.txt",),
    "facebook": ("facebook/post.txt",),
    "reddit": ("reddit/post.md", "reddit/subreddit-research.md"),
    "instagram": ("instagram/caption.txt", "instagram/hashtags.txt", "instagram/alt-text.txt"),
    "x": ("x/posts.txt",),
    "threads": ("threads/posts.txt",),
    "medium": ("medium/article.md", "medium/metadata.md"),
    "dm": ("dm/outreach-sequences.md", "dm/personalisation-notes.md"),
    "email": ("email/cold-email.txt", "email/cold-email.html"),
    "newsletter": ("newsletter/newsletter.md", "newsletter/newsletter.html"),
}
OUTPUT_DIRECTORIES = PLATFORMS + ("assets", "review")
PLACEHOLDER_RE = re.compile(r"\{\{\s*([A-Za-z0-9_. -]+?)\s*\}\}|\[(?:TODO|TBD|INSERT|PLACEHOLDER)(?::[^\]]*)?\]", re.I)
BLOCKING_RE = re.compile(r"\[(?:BLOCKING|REQUIRED)(?::[^\]]*)?\]", re.I)
URL_RE = re.compile(r'https?://[^\s<>\]\)\}"\']+', re.I)
MARKDOWN_LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
INVALID_NAME_RE = re.compile(r'[<>:"/\\|?*]|[. ]$')
SENSITIVE_PATTERNS = {
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "AWS access key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    "generic API token": re.compile(r"\b(?:api[_-]?key|secret|token)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{20,}", re.I),
    "internal URL": re.compile(r"https?://(?:localhost|127\.0\.0\.1|[^/\s]+\.(?:internal|local))(?:[:/]|\b)", re.I),
}
UNSUPPORTED_CLAIM_PATTERNS = {
    "guarantee": re.compile(r"\bguarantee(?:d|s)?\b", re.I),
    "unsupported ranking": re.compile(r"(?:\bnumber\s+one\b|#1|\bbest[- ]in[- ]class\b)", re.I),
    "unsupported adoption metric": re.compile(r"\b(?:trusted|used|loved) by\s+[0-9][0-9,]*(?:\+|\s+(?:customers|companies|teams|people))", re.I),
    "unsupported performance metric": re.compile(r"\b(?:increase[sd]?|reduce[sd]?|improve[sd]?|faster|more)\b[^.\n]{0,50}\b\d+(?:\.\d+)?%", re.I),
}


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def today_utc() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")
    if not slug:
        raise ValueError("Campaign title must contain at least one letter or number")
    return slug[:80].rstrip("-")


def validate_platforms(platforms: Sequence[str]) -> list[str]:
    cleaned = list(dict.fromkeys(item.strip().lower() for item in platforms if item.strip()))
    invalid = sorted(set(cleaned) - set(PLATFORMS))
    if invalid:
        raise ValueError(f"Unsupported platform(s): {', '.join(invalid)}")
    if not cleaned:
        raise ValueError("Select at least one platform")
    return cleaned


def safe_child(root: Path, relative: str | Path) -> Path:
    root = root.resolve()
    target = (root / relative).resolve()
    try:
        target.relative_to(root)
    except ValueError as exc:
        raise ValueError(f"Path escapes campaign root: {relative}") from exc
    return target


def read_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValueError(f"Expected a JSON object in {path}")
    return value


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def load_brief(path: Path | None) -> tuple[dict, str | None]:
    if path is None:
        return {}, None
    raw = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        value = json.loads(raw)
        if not isinstance(value, dict):
            raise ValueError("JSON brief must be an object")
        return value, raw
    return {}, raw


def md_value(value: object, unknown_label: str) -> str:
    if value is None or value == "" or value == []:
        return f"UNKNOWN [TODO: {unknown_label}]"
    if isinstance(value, list):
        return ", ".join(str(item) for item in value)
    return str(value)


def context_questions(data: dict) -> list[dict[str, str]]:
    audience = data.get("audience", {})
    if isinstance(audience, list):
        audience = audience[0] if audience else {}
    checks = (
        ("product.name", data.get("product", {}).get("name"), "blocking", "What is the public product or offer name?"),
        ("product.description", data.get("product", {}).get("description"), "blocking", "What does the product do in one or two factual sentences?"),
        ("audience.primary", audience.get("primary") or audience.get("name"), "blocking", "Who is the primary audience for this campaign?"),
        ("offer.primary_cta", data.get("offer", {}).get("primary_cta"), "blocking", "What single action should the audience take?"),
        ("offer.cta_destination", data.get("offer", {}).get("cta_destination"), "blocking", "Where should the primary CTA send people?"),
        ("product.how_it_works", data.get("product", {}).get("how_it_works"), "important", "How does the product work at a useful level of detail?"),
        ("evidence", data.get("evidence"), "important", "What public evidence supports substantive claims?"),
        ("brand.voice", data.get("brand", {}).get("voice"), "important", "Which voice traits should the campaign preserve?"),
        ("campaign.deadline", data.get("campaign", {}).get("deadline"), "optional", "Is there a campaign deadline?"),
    )
    return [
        {"field": field_name, "severity": severity, "question": question}
        for field_name, value, severity, question in checks
        if value is None or value == "" or value == []
    ]


def _render_context_files(title: str, objective: str, platforms: Sequence[str], data: dict) -> dict[str, str]:
    campaign = data.get("campaign", {})
    brand = data.get("brand", {})
    product = data.get("product", {})
    audience = data.get("audience", {})
    if isinstance(audience, list):
        audience = audience[0] if audience else {}
    offer = data.get("offer", {})
    questions = context_questions(data)
    question_rows = "\n".join(
        f"- **{item['severity']} — {item['field']}**: {item['question']}" for item in questions
    ) or "- No missing fields detected from the supplied structured brief."
    source_rows = []
    for source in data.get("sources", []):
        if isinstance(source, dict) and source.get("url"):
            source_rows.append(f"- [{source.get('label', 'Source')}]({source['url']}) — {source.get('purpose', 'source')}")
    sources = "\n".join(source_rows) or "- UNKNOWN [TODO: add authoritative public source links]"
    return {
        "campaign.md": f"""# Campaign\n\n- Title: {title}\n- Objective: {objective}\n- Primary conversion action: {md_value(campaign.get('primary_conversion_action'), 'primary conversion action')}\n- Secondary conversion action: {md_value(campaign.get('secondary_conversion_action'), 'secondary conversion action')}\n- Duration: {md_value(campaign.get('duration'), 'campaign duration')}\n- Priority platforms: {', '.join(platforms)}\n- Publishing frequency: {md_value(campaign.get('publishing_frequency'), 'publishing frequency')}\n- Distribution: {campaign.get('distribution', 'unknown')}\n- Publisher identity: {campaign.get('publisher_identity', 'unknown')}\n- Visual mode: {campaign.get('visual_mode', 'none')}\n- Deadline: {md_value(campaign.get('deadline'), 'campaign deadline')}\n""",
        "brand.md": f"""# Brand\n\n- Name: {md_value(brand.get('name'), 'brand name')}\n- Positioning: {md_value(brand.get('positioning'), 'brand positioning')}\n- Voice: {md_value(brand.get('voice'), 'brand voice')}\n- Prefer: {md_value(brand.get('prefer'), 'preferred terms')}\n- Avoid: {md_value(brand.get('avoid'), 'terms to avoid')}\n- Formatting: {md_value(brand.get('formatting_preferences'), 'formatting preferences')}\n- Claim restrictions: {md_value(brand.get('claim_restrictions'), 'claim restrictions')}\n- Competitor policy: {md_value(brand.get('competitor_policy'), 'competitor reference policy')}\n- Narrative person: {brand.get('narrative_person', 'first_plural')}\n""",
        "product.md": f"""# Product\n\n- Name: {md_value(product.get('name'), 'product name')}\n- Category: {md_value(product.get('category'), 'product category')}\n- Description: {md_value(product.get('description'), 'product description')}\n- Main problem: {md_value(product.get('problem'), 'main problem')}\n- How it works: {md_value(product.get('how_it_works'), 'how it works')}\n- Features: {md_value(product.get('features'), 'verified features')}\n- Benefits: {md_value(product.get('benefits'), 'supported benefits')}\n- Differentiators: {md_value(product.get('differentiators'), 'supported differentiators')}\n- Maturity: {product.get('maturity', 'unknown')}\n- Commercial model: {md_value(product.get('commercial_model'), 'commercial model or pricing')}\n- Availability: {md_value(product.get('availability'), 'market availability')}\n- Restrictions: {md_value(product.get('restrictions'), 'restrictions')}\n- Prerequisites: {md_value(product.get('prerequisites'), 'prerequisites')}\n""",
        "audience.md": f"""# Audience\n\n- Primary audience: {md_value(audience.get('primary') or audience.get('name'), 'primary audience')}\n- Secondary audience: {md_value(audience.get('secondary'), 'secondary audience')}\n- Buyer versus user: {audience.get('buyer_or_user', 'unknown')}\n- Industry: {md_value(audience.get('industry'), 'industry')}\n- Organisation size: {md_value(audience.get('organisation_size'), 'organisation size')}\n- Technical sophistication: {audience.get('technical_sophistication', 'unknown')}\n- Existing alternatives: {md_value(audience.get('alternatives'), 'alternatives')}\n- Pain points: {md_value(audience.get('pain_points'), 'pain points')}\n- Objections: {md_value(audience.get('objections'), 'objections')}\n- Desired outcome: {md_value(audience.get('desired_outcome'), 'desired outcome')}\n- Awareness level: {audience.get('awareness_level', 'unknown')}\n- Geographic focus: {md_value(audience.get('geographies'), 'geographic focus')}\n""",
        "offer.md": f"""# Offer\n\n- Value proposition: {md_value(offer.get('value_proposition'), 'value proposition')}\n- Product promise: {md_value(offer.get('promise'), 'carefully qualified product promise')}\n- Primary CTA: {md_value(offer.get('primary_cta'), 'primary CTA')}\n- Secondary CTA: {md_value(offer.get('secondary_cta'), 'secondary CTA')}\n- CTA destination: {md_value(offer.get('cta_destination'), 'CTA destination')}\n- Pricing: {md_value(offer.get('pricing'), 'verified pricing')}\n- Incentive: {md_value(offer.get('incentive'), 'incentive')}\n- Urgency: {md_value(offer.get('urgency'), 'real urgency only')}\n- Eligibility: {md_value(offer.get('eligibility'), 'eligibility')}\n- Terms: {md_value(offer.get('terms'), 'offer terms')}\n""",
        "sources.md": f"# Source-of-truth links\n\n{sources}\n\nDo not silently change destinations. Add UTM variants as separate labelled links.\n",
        "questions.md": f"# Context questions\n\nAsk blocking questions before generation. Ask important questions only when needed for the requested output.\n\n{question_rows}\n",
    }


def initialise_campaign(
    campaigns_root: Path,
    title: str,
    objective: str,
    platforms: Sequence[str],
    brief_path: Path | None = None,
    slug: str | None = None,
) -> Path:
    platforms = validate_platforms(platforms)
    campaign_slug = slugify(slug or title)
    campaigns_root.mkdir(parents=True, exist_ok=True)
    target = safe_child(campaigns_root, campaign_slug)
    if target.exists():
        raise FileExistsError(f"Campaign already exists: {target}")
    data, raw_brief = load_brief(brief_path)
    target.mkdir()
    for directory in ("context", "strategy", "assets/source", "assets/generated", "review/history", *platforms):
        safe_child(target, directory).mkdir(parents=True, exist_ok=True)
    for filename, content in _render_context_files(title, objective, platforms, data).items():
        safe_child(target / "context", filename).write_text(content, encoding="utf-8")
    if raw_brief:
        suffix = brief_path.suffix.lower() if brief_path else ".txt"
        safe_child(target / "assets/source", f"original-brief{suffix}").write_text(raw_brief, encoding="utf-8")
    strategy_files = {
        "campaign-strategy.md": "# Campaign strategy\n\n[BLOCKING: Create strategy before platform content.]\n",
        "messaging-pillars.md": "# Messaging pillars\n\n[BLOCKING: Define three to five pillars.]\n",
        "content-map.md": "# Content map\n\n[BLOCKING: Map platform outputs to messaging pillars.]\n",
        "publishing-sequence.md": "# Publishing sequence\n\n[TODO: Define order, timing, dependencies, and channel roles.]\n",
        "assumptions.md": "# Assumptions\n\n- No material assumptions recorded. Add each assumption before relying on it.\n",
    }
    for filename, content in strategy_files.items():
        safe_child(target / "strategy", filename).write_text(content, encoding="utf-8")
    safe_child(target, "README.md").write_text(
        f"# {title}\n\nCampaign slug: `{campaign_slug}`\n\nObjective: {objective}\n\n"
        "Edit central context and strategy before regenerating outputs. See `review/revision-log.md` for history.\n",
        encoding="utf-8",
    )
    safe_child(target / "review", "revision-log.md").write_text(
        f"# Revision log\n\n- {utc_now()} — Campaign initialised.\n", encoding="utf-8"
    )
    manifest = {
        "campaign_id": str(uuid.uuid4()),
        "campaign_slug": campaign_slug,
        "campaign_title": title,
        "created_at": utc_now(),
        "updated_at": utc_now(),
        "skill_version": SKILL_VERSION,
        "campaign_objective": objective,
        "selected_platforms": platforms,
        "generated_files": [],
        "generation_status": "initialised",
        "validation_status": "not_run",
        "source_links": [],
        "unresolved_placeholders": [],
        "assumptions": [],
        "current_revision": 1,
        "platform_constraint_verification_dates": {},
        "image_generation_status": "disabled",
        "stale_outputs": [],
        "file_hashes": {},
        "last_validation_at": None,
        "archived_at": None,
    }
    write_json(target / "manifest.json", manifest)
    build_manifest(target)
    return target


def iter_public_files(campaign: Path) -> Iterable[Path]:
    excluded_parts = {"history"}
    for path in sorted(campaign.rglob("*")):
        if not path.is_file() or path.name == "manifest.json":
            continue
        relative = path.relative_to(campaign)
        if any(part in excluded_parts for part in relative.parts):
            continue
        yield path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def extract_urls(text: str) -> list[str]:
    return [match.rstrip(".,;:") for match in URL_RE.findall(text)]


def find_placeholders(text: str) -> list[str]:
    return sorted({match.group(0) for match in PLACEHOLDER_RE.finditer(text)})


def count_characters(text: str) -> int:
    """Return the Unicode code-point count used by deterministic limit checks."""
    return len(text)


def weighted_url_character_count(text: str, url_weight: int) -> int:
    """Count text while treating each HTTP(S) URL as a fixed platform weight."""
    total = len(text)
    for url in extract_urls(text):
        total += url_weight - len(url)
    return total


def _list_assumptions(path: Path) -> list[str]:
    if not path.exists():
        return []
    return [
        line[2:].strip()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.startswith("- ") and "No material assumptions" not in line
    ]


def load_constraints(skill_root: Path) -> dict:
    path = skill_root / "config" / "platform-constraints.json"
    return read_json(path) if path.exists() else {"platforms": {}}


def build_manifest(campaign: Path, constraints: dict | None = None) -> dict:
    campaign = campaign.resolve()
    manifest_path = campaign / "manifest.json"
    manifest = read_json(manifest_path)
    files = list(iter_public_files(campaign))
    manifest["updated_at"] = utc_now()
    manifest["generated_files"] = [path.relative_to(campaign).as_posix() for path in files]
    manifest["file_hashes"] = {
        path.relative_to(campaign).as_posix(): sha256_file(path) for path in files
    }
    all_text = "\n".join(
        path.read_text(encoding="utf-8", errors="replace")
        for path in files
        if path.suffix.lower() in {".md", ".txt", ".html", ".json", ".yaml", ".yml"}
        and path.relative_to(campaign).as_posix() != "review/validation-report.md"
    )
    manifest["unresolved_placeholders"] = find_placeholders(all_text)
    manifest["source_links"] = sorted(set(extract_urls((campaign / "context/sources.md").read_text(encoding="utf-8"))))
    manifest["assumptions"] = _list_assumptions(campaign / "strategy/assumptions.md")
    if constraints:
        manifest["platform_constraint_verification_dates"] = {
            platform: constraints.get("platforms", {}).get(platform, {}).get("last_verified")
            for platform in manifest["selected_platforms"]
        }
    write_json(manifest_path, manifest)
    return manifest


def load_context(campaign: Path, sections: Sequence[str]) -> dict[str, str]:
    invalid = sorted(set(sections) - set(CONTEXT_SECTIONS))
    if invalid:
        raise ValueError(f"Unknown context section(s): {', '.join(invalid)}")
    return {
        section: safe_child(campaign / "context", f"{section}.md").read_text(encoding="utf-8")
        for section in sections
    }


def backup_and_replace(campaign: Path, relative_file: str, replacement: Path, reason: str) -> Path:
    campaign = campaign.resolve()
    target = safe_child(campaign, relative_file)
    if not target.exists() or not target.is_file():
        raise FileNotFoundError(f"Cannot revise missing file: {relative_file}")
    manifest = read_json(campaign / "manifest.json")
    revision = int(manifest.get("current_revision", 1)) + 1
    backup = safe_child(campaign / "review/history", f"revision-{revision}/{relative_file}")
    backup.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(target, backup)
    replacement_text = replacement.read_text(encoding="utf-8")
    target.write_text(replacement_text, encoding="utf-8")
    manifest["current_revision"] = revision
    manifest["updated_at"] = utc_now()
    if relative_file.startswith("context/") or relative_file.startswith("strategy/"):
        stale = set(manifest.get("stale_outputs", []))
        stale.update(
            path
            for path in manifest.get("generated_files", [])
            if path.split("/", 1)[0] in PLATFORMS
        )
        manifest["stale_outputs"] = sorted(stale)
    else:
        manifest["stale_outputs"] = [
            item for item in manifest.get("stale_outputs", []) if item != relative_file
        ]
    write_json(campaign / "manifest.json", manifest)
    with (campaign / "review/revision-log.md").open("a", encoding="utf-8") as handle:
        handle.write(f"- {utc_now()} — Revision {revision}: `{relative_file}` — {reason}\n")
    build_manifest(campaign)
    return backup


def archive_campaign(campaign: Path, archive_root: Path) -> Path:
    campaign = campaign.resolve()
    manifest = read_json(campaign / "manifest.json")
    archive_root.mkdir(parents=True, exist_ok=True)
    archive_name = f"{manifest['campaign_slug']}-r{manifest['current_revision']}.zip"
    destination = safe_child(archive_root, archive_name)
    if destination.exists():
        raise FileExistsError(f"Archive already exists: {destination}")
    manifest["generation_status"] = "archived"
    manifest["archived_at"] = utc_now()
    manifest["updated_at"] = utc_now()
    write_json(campaign / "manifest.json", manifest)
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(campaign.rglob("*")):
            if path.is_file():
                archive.write(path, arcname=f"{campaign.name}/{path.relative_to(campaign).as_posix()}")
    return destination


def valid_url(url: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc) and " " not in url


class SimpleHTMLValidator(html.parser.HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.errors: list[str] = []
        self.current_anchor_href: str | None = None
        self.current_anchor_text: list[str] = []
        self.raw_url_anchors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        attributes = dict(attrs)
        if tag not in self.VOID:
            self.stack.append(tag)
        if tag == "a":
            self.current_anchor_href = attributes.get("href")
            self.current_anchor_text = []
        if tag == "img" and not (attributes.get("alt") or "").strip():
            self.errors.append("Image is missing non-empty alt text")

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "a" and self.current_anchor_href:
            anchor_text = "".join(self.current_anchor_text).strip()
            if anchor_text.startswith(("http://", "https://")):
                self.raw_url_anchors.append(anchor_text)
            self.current_anchor_href = None
            self.current_anchor_text = []
        if tag in self.VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(f"Unexpected closing tag </{tag}>")
            return
        self.stack.pop()

    def handle_data(self, data: str) -> None:
        if self.current_anchor_href is not None:
            self.current_anchor_text.append(data)

    def close(self) -> None:
        super().close()
        if self.stack:
            self.errors.append(f"Unclosed HTML tag(s): {', '.join(self.stack)}")


@dataclass
class ValidationReport:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    suggestions: list[str] = field(default_factory=list)

    @property
    def status(self) -> str:
        if self.errors:
            return "failed"
        if self.warnings:
            return "warnings"
        return "passed"

    def markdown(self, campaign_title: str) -> str:
        def section(title: str, items: list[str]) -> str:
            body = "\n".join(f"- {item}" for item in items) if items else "- None."
            return f"## {title}\n\n{body}\n"

        return (
            f"# Validation report: {campaign_title}\n\n"
            f"- Status: **{self.status}**\n"
            f"- Generated: {utc_now()}\n\n"
            + section(f"Errors ({len(self.errors)})", self.errors)
            + "\n"
            + section(f"Warnings ({len(self.warnings)})", self.warnings)
            + "\n"
            + section(f"Suggestions ({len(self.suggestions)})", self.suggestions)
        )


def _output_text_files(campaign: Path) -> list[Path]:
    return [
        path
        for platform in PLATFORMS
        for path in (campaign / platform).rglob("*") if (campaign / platform).exists() and path.is_file()
        if path.suffix.lower() in {".md", ".txt", ".html"}
    ]


def _normalize_copy(text: str) -> str:
    text = re.sub(r"^---.*?---", "", text, flags=re.S)
    return re.sub(r"\W+", " ", text.lower()).strip()


def _read_label(path: Path, label: str) -> str | None:
    if not path.exists():
        return None
    match = re.search(rf"^-\s*{re.escape(label)}:\s*(.+)$", path.read_text(encoding="utf-8"), re.M | re.I)
    return match.group(1).strip() if match else None


def _broken_internal_links(campaign: Path, source: Path, text: str) -> list[str]:
    broken: list[str] = []
    for raw_target in MARKDOWN_LINK_RE.findall(text):
        target = raw_target.strip().strip("<>")
        if not target or target.startswith(("#", "http://", "https://", "mailto:", "{{")):
            continue
        target = urllib.parse.unquote(target.split("#", 1)[0].split("?", 1)[0])
        resolved = (source.parent / target).resolve()
        try:
            resolved.relative_to(campaign)
        except ValueError:
            broken.append(f"link escapes campaign root: {raw_target}")
            continue
        if not resolved.exists():
            broken.append(raw_target)
    return broken


def _post_chunks(path: Path, heading_pattern: str | None = None) -> list[str]:
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8").strip()
    if heading_pattern:
        parts = re.split(heading_pattern, text, flags=re.M | re.I)[1:]
        return [part.strip() for part in parts if part.strip()]
    return [chunk.strip() for chunk in re.split(r"\n\s*---\s*\n|\n{3,}", text) if chunk.strip()]


def validate_campaign(campaign: Path, constraints: dict | None = None, stale_days: int = 120) -> ValidationReport:
    campaign = campaign.resolve()
    report = ValidationReport()
    manifest_path = campaign / "manifest.json"
    if not manifest_path.exists():
        report.errors.append("Missing manifest.json")
        return report
    try:
        manifest = read_json(manifest_path)
    except (ValueError, json.JSONDecodeError) as exc:
        report.errors.append(f"Invalid manifest.json: {exc}")
        return report
    for relative in REQUIRED_CAMPAIGN_FILES:
        path = safe_child(campaign, relative)
        if not path.exists():
            report.errors.append(f"Missing required file: `{relative}`")
    selected = manifest.get("selected_platforms", [])
    invalid = sorted(set(selected) - set(PLATFORMS))
    if invalid:
        report.errors.append(f"Manifest contains unsupported platform(s): {', '.join(invalid)}")
    if manifest.get("generation_status") == "complete":
        for platform in selected:
            for relative in MINIMUM_PLATFORM_FILES[platform]:
                if not safe_child(campaign, relative).exists():
                    report.errors.append(f"Complete campaign is missing `{relative}`")
    for path in campaign.rglob("*"):
        if INVALID_NAME_RE.search(path.name):
            report.errors.append(f"Filesystem-invalid name: `{path.relative_to(campaign).as_posix()}`")
        if path.is_file() and path.name != "manifest.json" and path.stat().st_size == 0:
            report.errors.append(f"Empty output file: `{path.relative_to(campaign).as_posix()}`")
    files = list(iter_public_files(campaign))
    actual_files = {path.relative_to(campaign).as_posix() for path in files}
    manifest_files = set(manifest.get("generated_files", []))
    for missing in sorted(actual_files - manifest_files):
        report.errors.append(f"Manifest is missing generated file: `{missing}`")
    for absent in sorted(manifest_files - actual_files):
        report.errors.append(f"Manifest lists absent file: `{absent}`")
    recorded_hashes = manifest.get("file_hashes", {})
    for path in files:
        relative = path.relative_to(campaign).as_posix()
        expected_hash = recorded_hashes.get(relative)
        if not expected_hash:
            report.errors.append(f"Manifest is missing a hash for `{relative}`")
        elif expected_hash != sha256_file(path):
            report.errors.append(f"Manifest hash is stale for `{relative}`")
    output_files = _output_text_files(campaign)
    all_public_text: list[tuple[Path, str]] = []
    for path in files:
        if path.suffix.lower() not in {".md", ".txt", ".html", ".json", ".yaml", ".yml"}:
            continue
        if path.relative_to(campaign).as_posix() == "review/validation-report.md":
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        all_public_text.append((path, text))
        relative = path.relative_to(campaign).as_posix()
        if BLOCKING_RE.search(text) and manifest.get("generation_status") != "initialised":
            report.errors.append(f"Blocking placeholder in `{relative}`")
        placeholders = find_placeholders(text)
        if placeholders:
            report.warnings.append(f"Unresolved placeholder(s) in `{relative}`: {', '.join(placeholders[:5])}")
        for name, pattern in SENSITIVE_PATTERNS.items():
            if pattern.search(text):
                report.errors.append(f"Suspected {name} in `{relative}`; review before publication")
        if path in output_files:
            for name, pattern in UNSUPPORTED_CLAIM_PATTERNS.items():
                if pattern.search(text) and "claim-source:" not in text.lower():
                    report.warnings.append(f"Potential {name} in `{relative}` without an inline `Claim-source:` note")
            if re.search(r"\b(?:as an ai|here(?:'s| is) the requested|i can help you)\b", text, re.I):
                report.warnings.append(f"Possible generation commentary in `{relative}`")
        for url in extract_urls(text):
            if not valid_url(url):
                report.errors.append(f"Malformed URL `{url}` in `{relative}`")
        if path.suffix.lower() == ".md":
            for target in _broken_internal_links(campaign, path, text):
                report.errors.append(f"Broken internal link `{target}` in `{relative}`")
    normalized = []
    for path in output_files:
        copy = _normalize_copy(path.read_text(encoding="utf-8", errors="replace"))
        if len(copy) >= 120:
            normalized.append((path, copy))
    for index, (left_path, left) in enumerate(normalized):
        for right_path, right in normalized[index + 1 :]:
            if left_path.parts[-2] == right_path.parts[-2]:
                continue
            ratio = SequenceMatcher(None, left, right).ratio()
            if ratio >= 0.90:
                report.warnings.append(
                    f"Likely cross-platform duplication ({ratio:.0%}): `{left_path.relative_to(campaign)}` and `{right_path.relative_to(campaign)}`"
                )
    reddit_post = campaign / "reddit/post.md"
    if "reddit" in selected and reddit_post.exists():
        reddit_text = reddit_post.read_text(encoding="utf-8")
        if not re.search(r"\b(disclos(?:ure|ed|ing)?|affiliat(?:e|ed|ion)?|i built|we built|our product|creator of)\b", reddit_text, re.I):
            report.errors.append("Reddit post is missing an affiliation disclosure")
        research = campaign / "reddit/subreddit-research.md"
        research_text = research.read_text(encoding="utf-8") if research.exists() else ""
        for heading in ("Rules checked", "Self-promotion", "Requirements", "Community fit"):
            if not re.search(rf"^#+\s+.*{re.escape(heading)}", research_text, re.M | re.I):
                report.errors.append(f"Reddit research is missing a `{heading}` heading")
        if not re.search(r"\b20\d{2}-\d{2}-\d{2}\b", research_text):
            report.errors.append("Reddit research is missing a rule-check date")
    if "instagram" in selected and (campaign / "instagram").exists():
        alt_path = campaign / "instagram/alt-text.txt"
        if not alt_path.exists() or not alt_path.read_text(encoding="utf-8").strip():
            report.errors.append("Instagram output is missing alt text")
    for folder, stem in (("email", "cold-email"), ("newsletter", "newsletter")):
        if folder not in selected:
            continue
        plain = campaign / folder / f"{stem}.txt"
        if folder == "newsletter" and not plain.exists():
            plain = campaign / folder / f"{stem}.md"
        rich = campaign / folder / f"{stem}.html"
        if rich.exists() and not plain.exists():
            report.errors.append(f"`{rich.relative_to(campaign)}` has no plain-text equivalent")
        if rich.exists():
            parser = SimpleHTMLValidator()
            try:
                parser.feed(rich.read_text(encoding="utf-8"))
                parser.close()
            except html.parser.HTMLParseError as exc:
                parser.errors.append(str(exc))
            for error in parser.errors:
                report.errors.append(f"Invalid HTML in `{rich.relative_to(campaign)}`: {error}")
            if parser.raw_url_anchors:
                report.warnings.append(f"Use descriptive hyperlink text in `{rich.relative_to(campaign)}`")
    product_name = _read_label(campaign / "context/product.md", "Name")
    if product_name and "UNKNOWN" not in product_name:
        for path in output_files:
            if path.parts[-2] in {"dm", "email", "newsletter", "medium"}:
                if product_name.lower() not in path.read_text(encoding="utf-8", errors="replace").lower():
                    report.suggestions.append(f"Confirm product naming in `{path.relative_to(campaign)}`")
    primary_cta = _read_label(campaign / "context/offer.md", "Primary CTA")
    if primary_cta and "UNKNOWN" not in primary_cta:
        manifest_ctas = [primary_cta.lower() in text.lower() for _, text in all_public_text if _ and _.parent.name in PLATFORMS]
        if manifest_ctas and not any(manifest_ctas):
            report.warnings.append("No platform output uses the central primary CTA wording; confirm CTA consistency")
    constraints = constraints or {"platforms": {}}
    now = datetime.now(timezone.utc).date()
    for platform in selected:
        entry = constraints.get("platforms", {}).get(platform, {})
        verified = entry.get("last_verified")
        if not verified:
            report.warnings.append(f"No constraint verification date for `{platform}`")
            continue
        try:
            age = (now - datetime.fromisoformat(verified).date()).days
        except ValueError:
            report.errors.append(f"Invalid constraint date for `{platform}`: {verified}")
            continue
        if age > stale_days:
            report.warnings.append(f"Platform constraints for `{platform}` are stale ({age} days old)")
    x_constraints = constraints.get("platforms", {}).get("x", {}).get("limits", {})
    x_limit = x_constraints.get("standard_post_characters")
    url_weight = x_constraints.get("url_counted_characters", 23)
    if x_limit:
        x_chunks = _post_chunks(campaign / "x/posts.txt") + _post_chunks(
            campaign / "x/thread.txt", r"^##\s+Post\s+\d+\s*$"
        )
        for index, chunk in enumerate(x_chunks, 1):
            count = weighted_url_character_count(chunk, int(url_weight))
            if count > int(x_limit):
                report.errors.append(f"X post {index} is {count} weighted characters; configured limit is {x_limit}")
    threads_limit = constraints.get("platforms", {}).get("threads", {}).get("limits", {}).get("post_characters")
    if threads_limit:
        threads_chunks = _post_chunks(campaign / "threads/posts.txt") + _post_chunks(
            campaign / "threads/thread.txt", r"^##\s+(?:Thought|Post)\s+\d+\s*$"
        )
        for index, chunk in enumerate(threads_chunks, 1):
            if len(chunk) > int(threads_limit):
                report.errors.append(f"Threads post {index} is {len(chunk)} characters; configured limit is {threads_limit}")
    linkedin_limits = constraints.get("platforms", {}).get("linkedin", {}).get("limits", {})
    for relative, key, label in (
        ("linkedin/post.txt", "post_characters", "LinkedIn post"),
        ("linkedin/article.md", "article_characters", "LinkedIn article"),
    ):
        limit = linkedin_limits.get(key)
        path = campaign / relative
        if limit and path.exists() and len(path.read_text(encoding="utf-8")) > int(limit):
            report.errors.append(f"{label} exceeds the configured {limit}-character limit")
    if manifest.get("stale_outputs"):
        report.warnings.append(f"Manifest marks {len(manifest['stale_outputs'])} output(s) stale after context changes")
    return report


def save_validation_report(campaign: Path, report: ValidationReport) -> Path:
    manifest = read_json(campaign / "manifest.json")
    path = campaign / "review/validation-report.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(report.markdown(manifest.get("campaign_title", campaign.name)), encoding="utf-8")
    manifest["validation_status"] = report.status
    manifest["last_validation_at"] = utc_now()
    manifest["updated_at"] = utc_now()
    write_json(campaign / "manifest.json", manifest)
    return path
