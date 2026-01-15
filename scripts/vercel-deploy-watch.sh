#!/usr/bin/env bash
set -euo pipefail

# Automates: commit/push/clean, then poll Vercel build via Cursor MCP.
# Requires: jq and a Cursor MCP helper named `cursor_mcp_call`.

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required." >&2
  exit 1
fi

if ! command -v cursor_mcp_call >/dev/null 2>&1; then
  cat <<'EOF' >&2
Error: cursor_mcp_call not found.
This script is intended to run in a Cursor environment that exposes MCP helpers.
EOF
  exit 1
fi

PROJECT_ID="${PROJECT_ID:-prj_qjWB222PQ5Uc9x0YAVbGcRtbUjaX}"
TEAM_ID="${TEAM_ID:-team_fcnQoFeks71q1etgQye5wSNx}"
COMMIT_MESSAGE="${COMMIT_MESSAGE:-chore: sync site updates and admin configs}"

git add .
git commit -m "$COMMIT_MESSAGE"
git push origin main

git clean -fd
git status -sb

DEPLOYMENT_ID="$(
  cursor_mcp_call user-vercel list_deployments \
    --projectId "$PROJECT_ID" --teamId "$TEAM_ID" \
    | jq -r '.deployments.deployments[0].id'
)"

if [[ -z "$DEPLOYMENT_ID" || "$DEPLOYMENT_ID" == "null" ]]; then
  echo "Error: unable to resolve latest deployment." >&2
  exit 1
fi

while true; do
  STATE="$(
    cursor_mcp_call user-vercel get_deployment \
      --idOrUrl "$DEPLOYMENT_ID" --teamId "$TEAM_ID" \
      | jq -r '.deployment.state'
  )"
  echo "Deployment $DEPLOYMENT_ID state: $STATE"

  if [[ "$STATE" == "READY" ]]; then
    echo "Build succeeded."
    break
  fi

  if [[ "$STATE" == "ERROR" ]]; then
    echo "Build failed. Fetching logs..."
    cursor_mcp_call user-vercel get_deployment_build_logs \
      --idOrUrl "$DEPLOYMENT_ID" --teamId "$TEAM_ID" --limit 200
    exit 1
  fi

  sleep 10
done
