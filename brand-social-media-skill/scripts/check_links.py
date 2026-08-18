#!/usr/bin/env python3
"""Check HTTP(S) URL syntax in campaign files without network access."""

import sys

from campaign_cli import main


if __name__ == "__main__":
    raise SystemExit(main(["check-links", *sys.argv[1:]]))

