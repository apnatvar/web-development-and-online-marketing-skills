#!/usr/bin/env python3
"""Compatibility entry point for campaign validation."""

import sys

from campaign_cli import main


if __name__ == "__main__":
    raise SystemExit(main(["validate", *sys.argv[1:]]))

