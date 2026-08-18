#!/usr/bin/env python3
"""List unresolved campaign placeholders."""

import sys

from campaign_cli import main


if __name__ == "__main__":
    raise SystemExit(main(["placeholders", *sys.argv[1:]]))

