import importlib.util
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "scripts" / "render_personalized_email.py"
SPEC = importlib.util.spec_from_file_location("renderer", SCRIPT)
assert SPEC and SPEC.loader
renderer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(renderer)


def test_render_escapes_text_and_url_attributes() -> None:
    template = 'Hi {{first_name}} <a href="{{campaign_url}}">Go</a>'
    record = {
        "first_name": "A&B",
        "campaign_url": "https://example.com/?x=1&y=2",
    }
    assert renderer.render(template, record, {}, True) == (
        'Hi A&amp;B <a href="https://example.com/?x=1&amp;y=2">Go</a>'
    )


def test_render_rejects_unsafe_url() -> None:
    try:
        renderer.render('<a href="{{campaign_url}}">Go</a>', {"campaign_url": "javascript:alert(1)"}, {}, True)
    except ValueError as error:
        assert "absolute HTTPS URL" in str(error)
    else:
        raise AssertionError("unsafe URL was accepted")


def test_render_requires_missing_value_in_strict_mode() -> None:
    try:
        renderer.render("Hi {{first_name}}", {}, {}, True)
    except ValueError as error:
        assert "missing value" in str(error)
    else:
        raise AssertionError("missing token was accepted")
