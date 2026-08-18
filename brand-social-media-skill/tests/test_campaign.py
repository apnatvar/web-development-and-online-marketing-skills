from __future__ import annotations

import shutil
import sys
import unittest
import uuid
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from campaign_lib import (  # noqa: E402
    archive_campaign,
    backup_and_replace,
    build_manifest,
    count_characters,
    find_placeholders,
    initialise_campaign,
    load_context,
    read_json,
    safe_child,
    slugify,
    valid_url,
    validate_campaign,
    validate_platforms,
    weighted_url_character_count,
)


class CampaignTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.test_temp_root = Path(__file__).parent / ".runtime"
        cls.test_temp_root.mkdir(parents=True, exist_ok=True)

    def setUp(self) -> None:
        self.temp = self.test_temp_root / str(uuid.uuid4())
        self.temp.mkdir()
        self.root = self.temp / "campaigns"
        self.fixture = Path(__file__).parent / "fixtures" / "fictional-brief.json"

    def tearDown(self) -> None:
        shutil.rmtree(self.temp)

    def initialise(self, platforms=("linkedin",)) -> Path:
        return initialise_campaign(
            self.root,
            "LumenDesk Fictional Launch",
            "Recruit fictional beta participants",
            platforms,
            brief_path=self.fixture,
        )

    def test_campaign_initialisation_from_product_brief(self) -> None:
        campaign = self.initialise(("linkedin", "email"))
        self.assertTrue((campaign / "context/product.md").exists())
        self.assertIn("LumenDesk", (campaign / "context/product.md").read_text(encoding="utf-8"))
        self.assertEqual(read_json(campaign / "manifest.json")["selected_platforms"], ["linkedin", "email"])

    def test_slug_creation(self) -> None:
        self.assertEqual(slugify("  Café & Product Launch!  "), "cafe-product-launch")
        with self.assertRaises(ValueError):
            slugify("---")

    def test_manifest_generation_tracks_files_and_hashes(self) -> None:
        campaign = self.initialise()
        manifest = build_manifest(campaign)
        self.assertIn("context/product.md", manifest["generated_files"])
        self.assertEqual(len(manifest["file_hashes"]["context/product.md"]), 64)

    def test_platform_selection_rejects_unknown_values(self) -> None:
        self.assertEqual(validate_platforms(["linkedin", "linkedin", "x"]), ["linkedin", "x"])
        with self.assertRaises(ValueError):
            validate_platforms(["myspace"])

    def test_character_counting_uses_unicode_code_points(self) -> None:
        self.assertEqual(count_characters("A🙂é"), 3)
        self.assertEqual(weighted_url_character_count("See https://example.com/long-path", 23), 27)

    def test_placeholder_detection(self) -> None:
        self.assertEqual(find_placeholders("Hello {{first_name}} [TODO: proof]"), ["[TODO: proof]", "{{first_name}}"])

    def test_url_validation(self) -> None:
        self.assertTrue(valid_url("https://example.com/path?q=one"))
        self.assertFalse(valid_url("javascript:alert(1)"))
        self.assertFalse(valid_url("https://example .com"))

    def test_broken_internal_markdown_link(self) -> None:
        campaign = self.initialise()
        (campaign / "README.md").write_text("[Missing file](missing.md)", encoding="utf-8")
        build_manifest(campaign)
        report = validate_campaign(campaign)
        self.assertTrue(any("Broken internal link" in item for item in report.errors))

    def test_valid_html_email_with_plain_text_equivalent(self) -> None:
        campaign = self.initialise(("email",))
        (campaign / "email/cold-email.txt").write_text("Hello — learn about LumenDesk.", encoding="utf-8")
        (campaign / "email/cold-email.html").write_text(
            '<html><body><p>Hello — learn about LumenDesk.</p><a href="https://example.com">Read the field guide</a></body></html>',
            encoding="utf-8",
        )
        build_manifest(campaign)
        report = validate_campaign(campaign)
        self.assertFalse(any("Invalid HTML" in item for item in report.errors))
        self.assertFalse(any("plain-text equivalent" in item for item in report.errors))

    def test_missing_plain_text_email_is_an_error(self) -> None:
        campaign = self.initialise(("email",))
        (campaign / "email/cold-email.html").write_text("<html><body><p>LumenDesk</p></body></html>", encoding="utf-8")
        build_manifest(campaign)
        report = validate_campaign(campaign)
        self.assertTrue(any("plain-text equivalent" in item for item in report.errors))

    def test_duplicate_content_detection_across_platforms(self) -> None:
        campaign = self.initialise(("linkedin", "facebook"))
        duplicated = ("LumenDesk keeps fictional sources and conclusions together for a decision. " * 4).strip()
        (campaign / "linkedin/post.txt").write_text(duplicated, encoding="utf-8")
        (campaign / "facebook/post.txt").write_text(duplicated, encoding="utf-8")
        build_manifest(campaign)
        report = validate_campaign(campaign)
        self.assertTrue(any("cross-platform duplication" in item for item in report.warnings))

    def test_reddit_disclosure_and_rule_research(self) -> None:
        campaign = self.initialise(("reddit",))
        (campaign / "reddit/post.md").write_text("LumenDesk helps organise fictional decisions.", encoding="utf-8")
        (campaign / "reddit/subreddit-research.md").write_text(
            "# Community fit\n\n# Rules checked\n\n2026-07-22\n\n# Self-promotion\n\nCheck first.\n\n# Requirements\n\nUnknown.\n",
            encoding="utf-8",
        )
        build_manifest(campaign)
        report = validate_campaign(campaign)
        self.assertTrue(any("affiliation disclosure" in item for item in report.errors))

    def test_reddit_explicit_disclosure_is_accepted(self) -> None:
        campaign = self.initialise(("reddit",))
        (campaign / "reddit/post.md").write_text(
            "Disclosure: our fictional team built LumenDesk. Here is the standalone method.", encoding="utf-8"
        )
        (campaign / "reddit/subreddit-research.md").write_text(
            "# Community fit\n\n# Rules checked\n\n2026-07-22\n\n# Self-promotion\n\nNot approved.\n\n# Requirements\n\nUnknown.\n",
            encoding="utf-8",
        )
        build_manifest(campaign)
        report = validate_campaign(campaign)
        self.assertFalse(any("affiliation disclosure" in item for item in report.errors))

    def test_missing_instagram_alt_text(self) -> None:
        campaign = self.initialise(("instagram",))
        report = validate_campaign(campaign)
        self.assertTrue(any("missing alt text" in item for item in report.errors))

    def test_stale_platform_constraint_warning(self) -> None:
        campaign = self.initialise(("x",))
        constraints = {"platforms": {"x": {"last_verified": "2020-01-01", "limits": {"standard_post_characters": 280}}}}
        report = validate_campaign(campaign, constraints, stale_days=30)
        self.assertTrue(any("constraints for `x` are stale" in item for item in report.warnings))

    def test_threads_character_limit(self) -> None:
        campaign = self.initialise(("threads",))
        (campaign / "threads/posts.txt").write_text("x" * 501, encoding="utf-8")
        build_manifest(campaign)
        constraints = {"platforms": {"threads": {"last_verified": "2026-07-22", "limits": {"post_characters": 500}}}}
        report = validate_campaign(campaign, constraints)
        self.assertTrue(any("Threads post" in item for item in report.errors))

    def test_regeneration_keeps_previous_revision(self) -> None:
        campaign = self.initialise(("linkedin",))
        target = campaign / "linkedin/post.txt"
        target.write_text("Original LumenDesk post", encoding="utf-8")
        replacement = self.temp / "replacement.txt"
        replacement.write_text("Revised LumenDesk post", encoding="utf-8")
        build_manifest(campaign)
        backup = backup_and_replace(campaign, "linkedin/post.txt", replacement, "Test a new hook")
        self.assertEqual(backup.read_text(encoding="utf-8"), "Original LumenDesk post")
        self.assertEqual(target.read_text(encoding="utf-8"), "Revised LumenDesk post")
        self.assertEqual(read_json(campaign / "manifest.json")["current_revision"], 2)

    def test_context_change_marks_outputs_stale(self) -> None:
        campaign = self.initialise(("linkedin",))
        output = campaign / "linkedin/post.txt"
        output.write_text("LumenDesk launch copy", encoding="utf-8")
        build_manifest(campaign)
        replacement = self.temp / "product.md"
        replacement.write_text((campaign / "context/product.md").read_text(encoding="utf-8") + "\n- New fact: Fictional.\n", encoding="utf-8")
        backup_and_replace(campaign, "context/product.md", replacement, "Update a product fact")
        self.assertIn("linkedin/post.txt", read_json(campaign / "manifest.json")["stale_outputs"])

    def test_unsupported_claim_detection(self) -> None:
        campaign = self.initialise(("linkedin",))
        (campaign / "linkedin/post.txt").write_text("LumenDesk is guaranteed to improve research by 75%.", encoding="utf-8")
        build_manifest(campaign)
        report = validate_campaign(campaign)
        self.assertTrue(any("Potential guarantee" in item for item in report.warnings))
        self.assertTrue(any("performance metric" in item for item in report.warnings))

    def test_context_loading_is_selective(self) -> None:
        campaign = self.initialise()
        context = load_context(campaign, ("product", "offer"))
        self.assertEqual(set(context), {"product", "offer"})
        self.assertIn("LumenDesk", context["product"])

    def test_campaign_folder_isolation(self) -> None:
        self.root.mkdir(parents=True)
        with self.assertRaises(ValueError):
            safe_child(self.root, "../escape")
        campaign = self.initialise()
        with self.assertRaises(FileExistsError):
            self.initialise()
        self.assertTrue(campaign.is_relative_to(self.root.resolve()))

    def test_archive_is_non_destructive(self) -> None:
        campaign = self.initialise()
        archive = archive_campaign(campaign, self.temp / "archives")
        self.assertTrue(archive.exists())
        self.assertTrue(campaign.exists())
        self.assertEqual(read_json(campaign / "manifest.json")["generation_status"], "archived")


if __name__ == "__main__":
    unittest.main()
