#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
"$SCRIPT_DIR/../node_modules/.bin/ts-node" "$SCRIPT_DIR/../src/cli.ts" "$@"