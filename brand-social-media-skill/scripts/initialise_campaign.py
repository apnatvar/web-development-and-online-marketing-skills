#!/usr/bin/env python3
"""Compatibility entry point for campaign initialisation."""

import sys

from campaign_cli import main


if __name__ == "__main__":
    raise SystemExit(main(["init", *sys.argv[1:]]))

