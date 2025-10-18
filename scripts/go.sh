#!/bin/bash
set -euo pipefail

# ---- Inputs ----
: "${SITE_NAME:=freepresspass-netlify}"
: "${GIT_REMOTE:?Set GIT_REMOTE to your Git repo URL (ssh/https)}"
: "${NETLIFY_AUTH_TOKEN:?Get from Netlify > User settings > Applications}"
: "${STRIPE_SECRET_KEY:?Stripe secret key}"
: "${STRIPE_PRICE_ID:?Stripe price id}"
: "${BRANCH:=main}"

# ---- Tooling ----
if ! command -v netlify >/dev/null 2>&1; then
  npm i -g netlify-cli@17
fi

# ---- Install deps for Netlify Functions (Stripe SDK) ----
if [ -f package.json ]; then
  npm install --no-audit --no-fund
fi

# ---- Git init + first commit (idempotent) ----
if [ ! -d .git ]; then
  git init
  git checkout -b "$BRANCH"
fi

git add -A
if ! git diff --cached --quiet; then
  git commit -m "chore: initial Netlify-ready site (press pass generator + Stripe)"
fi

# ---- Auth (non-interactive via token) ----
export NETLIFY_AUTH_TOKEN

# ---- Link to existing site by name or create new ----
if netlify status 2>/dev/null | grep -q "Site ID"; then
  echo "Netlify already linked."
else
  # Try to link by name (falls back to create)
  if netlify sites:list --json | jq -r '.[].name' 2>/dev/null | grep -qx "$SITE_NAME"; then
    SITE_ID=$(netlify sites:list --json | jq -r ".[] | select(.name==&quot;$SITE_NAME&quot;).id")
    netlify link --id "$SITE_ID"
  else
    netlify sites:create --name "$SITE_NAME"
  fi
fi

# ---- Netlify Environment variables ----
netlify env:set STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"
netlify env:set STRIPE_PRICE_ID   "$STRIPE_PRICE_ID"

# ---- Preview deploy (ok if it fails the first time) ----
netlify deploy --dir . --message "preview deploy" --functions netlify/functions --json >/dev/null || true

# ---- Git remote + push ----
if ! git remote | grep -qx origin; then
  git remote add origin "$GIT_REMOTE"
fi
git push -u origin "$BRANCH" || true

# ---- Production deploy ----
netlify deploy --prod --dir . --functions netlify/functions --message "prod deploy"

# ---- Show site URL (portable awk instead of sed backrefs) ----
NETLIFY_URL="$(netlify status 2>/dev/null | awk -F'Site URL: ' '/Site URL:/{print $2; exit}')"
echo ""
echo "✅ Done."
echo "   Netlify URL: ${NETLIFY_URL:-<open Netlify dashboard>}"
echo "   Repo: $(git remote get-url origin)  branch: $BRANCH"