#!/usr/bin/env python3
"""Count Unicode characters exactly as Python sees them."""

import sys

from campaign_cli import main


if __name__ == "__main__":
    raise SystemExit(main(["count", *sys.argv[1:]]))

