#!/usr/bin/env python3
"""Compatibility entry point for manifest rebuilding."""

import sys

from campaign_cli import main


if __name__ == "__main__":
    raise SystemExit(main(["manifest", *sys.argv[1:]]))

