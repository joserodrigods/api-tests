#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ ! -f "$ROOT_DIR/.env" ]]; then
  echo "File not found: $ROOT_DIR/.env" >&2
  exit 1
fi

set -a
# shellcheck source=/dev/null
source "$ROOT_DIR/.env"
set +a

API_BASE_URL="${API_BASE_URL%/}"

required=(API_BASE_URL API_KEY API_TOKEN BOARD_ID BOARD_SHORT_ID)
for name in "${required[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "Required environment variable missing: $name" >&2
    exit 1
  fi
done

echo "=== GET /boards/{BOARD_ID} (name and URL) ==="
curl -sS -w "\n[HTTP %{http_code}]\n" \
  "${API_BASE_URL}/boards/${BOARD_ID}?fields=name,url&key=${API_KEY}&token=${API_TOKEN}"

echo ""
echo "=== GET /boards/{BOARD_SHORT_ID}/lists (names and ids) ==="
curl -sS -w "\n[HTTP %{http_code}]\n" \
  "${API_BASE_URL}/boards/${BOARD_SHORT_ID}/lists?fields=name,id&key=${API_KEY}&token=${API_TOKEN}"

echo ""
