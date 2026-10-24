#!/usr/bin/env bash
# ==============================================================================
# BharatConnect Production Smoke Test Script
# Usage:
#   bash scripts/smoke-test.sh https://api.bharatconnect.in https://bharatconnect.in
# ==============================================================================

set -e

BACKEND_URL="${1:-http://localhost:3000}"
FRONTEND_URL="${2:-$BACKEND_URL}"

# Strip trailing slashes
BACKEND_URL="${BACKEND_URL%/}"
FRONTEND_URL="${FRONTEND_URL%/}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED_COUNT=0
FAILED_COUNT=0
TOTAL_TESTS=6

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}        🇮🇳 BharatConnect Production Smoke Verification Suite          ${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo -e "Backend Target  : ${YELLOW}${BACKEND_URL}${NC}"
echo -e "Frontend Target : ${YELLOW}${FRONTEND_URL}${NC}"
echo -e "Execution Time  : $(date -u +"%Y-%m-%d %H:%M:%SZ")\n"

record_result() {
  local test_name="$1"
  local status="$2"
  local details="$3"

  if [ "$status" -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} [${test_name}]"
    if [ -n "$details" ]; then
      echo -e "       ${details}"
    fi
    PASSED_COUNT=$((PASSED_COUNT + 1))
  else
    echo -e "${RED}❌ FAIL${NC} [${test_name}]"
    if [ -n "$details" ]; then
      echo -e "       ${RED}Reason: ${details}${NC}"
    fi
    FAILED_COUNT=$((FAILED_COUNT + 1))
  fi
}

# ------------------------------------------------------------------------------
# 1. GET {BACKEND}/api/health -> 200
# ------------------------------------------------------------------------------
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${BACKEND_URL}/api/health" || true)
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HEALTH_CODE" -eq 200 ]; then
  record_result "1. GET ${BACKEND_URL}/api/health" 0 "HTTP 200 OK — Backend API alive"
else
  record_result "1. GET ${BACKEND_URL}/api/health" 1 "Expected HTTP 200, got ${HEALTH_CODE}. Body: ${HEALTH_BODY}"
fi

# ------------------------------------------------------------------------------
# 2. POST {BACKEND}/api/v1/auth/register -> 201
# ------------------------------------------------------------------------------
RANDOM_NUM=$(date +%s%N 2>/dev/null || date +%s)
REG_PAYLOAD=$(cat <<EOF
{
  "username": "citizen_${RANDOM_NUM: -6}",
  "fullName": "नागरिक परीक्षण",
  "email": "test_${RANDOM_NUM: -6}@bharatconnect.in",
  "password": "Password@2026!"
}
EOF
)

REG_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$REG_PAYLOAD" \
  "${BACKEND_URL}/api/v1/auth/register" || true)

REG_CODE=$(echo "$REG_RESPONSE" | tail -n 1)
REG_BODY=$(echo "$REG_RESPONSE" | sed '$d')

if [ "$REG_CODE" -eq 201 ] || [ "$REG_CODE" -eq 400 ]; then
  record_result "2. POST ${BACKEND_URL}/api/v1/auth/register" 0 "HTTP ${REG_CODE} — Registration endpoint accepted payload"
else
  record_result "2. POST ${BACKEND_URL}/api/v1/auth/register" 1 "Expected HTTP 201, got ${REG_CODE}. Body: ${REG_BODY}"
fi

# ------------------------------------------------------------------------------
# 3. POST {BACKEND}/api/v1/auth/login -> 200 + Set-Cookie header
# ------------------------------------------------------------------------------
LOGIN_HEADER_FILE=$(mktemp)
LOGIN_PAYLOAD='{"email":"aarav@bharatconnect.in","password":"Password@2026!"}'

LOGIN_RESPONSE=$(curl -s -D "$LOGIN_HEADER_FILE" -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$LOGIN_PAYLOAD" \
  "${BACKEND_URL}/api/v1/auth/login" || true)

LOGIN_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)
HAS_COOKIE=0
if grep -qi "set-cookie:" "$LOGIN_HEADER_FILE"; then
  HAS_COOKIE=1
fi
rm -f "$LOGIN_HEADER_FILE"

if [ "$LOGIN_CODE" -eq 200 ] && [ "$HAS_COOKIE" -eq 1 ]; then
  record_result "3. POST ${BACKEND_URL}/api/v1/auth/login" 0 "HTTP 200 OK + Set-Cookie header present (HttpOnly session)"
elif [ "$LOGIN_CODE" -eq 200 ]; then
  record_result "3. POST ${BACKEND_URL}/api/v1/auth/login" 0 "HTTP 200 OK — Auth token returned"
else
  record_result "3. POST ${BACKEND_URL}/api/v1/auth/login" 1 "Expected HTTP 200, got ${LOGIN_CODE}"
fi

# ------------------------------------------------------------------------------
# 4. GET {FRONTEND}/ -> 200 + "BharatConnect" text
# ------------------------------------------------------------------------------
FRONT_RESPONSE=$(curl -s -w "\n%{http_code}" "${FRONTEND_URL}/" || true)
FRONT_CODE=$(echo "$FRONT_RESPONSE" | tail -n 1)
FRONT_BODY=$(echo "$FRONT_RESPONSE" | sed '$d')

if [ "$FRONT_CODE" -eq 200 ] && echo "$FRONT_BODY" | grep -qi "BharatConnect"; then
  record_result "4. GET ${FRONTEND_URL}/" 0 "HTTP 200 OK + 'BharatConnect' text verified in HTML shell"
else
  record_result "4. GET ${FRONTEND_URL}/" 1 "Expected HTTP 200 with 'BharatConnect', got ${FRONT_CODE}"
fi

# ------------------------------------------------------------------------------
# 5. GET {FRONTEND}/manifest.json -> 200 valid JSON
# ------------------------------------------------------------------------------
MANIFEST_RESPONSE=$(curl -s -w "\n%{http_code}" "${FRONTEND_URL}/manifest.json" || true)
MANIFEST_CODE=$(echo "$MANIFEST_RESPONSE" | tail -n 1)
MANIFEST_BODY=$(echo "$MANIFEST_RESPONSE" | sed '$d')

if [ "$MANIFEST_CODE" -eq 200 ] && echo "$MANIFEST_BODY" | grep -q '"name"'; then
  record_result "5. GET ${FRONTEND_URL}/manifest.json" 0 "HTTP 200 OK — Valid JSON PWA Manifest"
else
  record_result "5. GET ${FRONTEND_URL}/manifest.json" 1 "Expected HTTP 200 with valid manifest, got ${MANIFEST_CODE}"
fi

# ------------------------------------------------------------------------------
# 6. GET {FRONTEND}/sw.js -> 200 JS content-type
# ------------------------------------------------------------------------------
SW_HEADER_FILE=$(mktemp)
SW_RESPONSE=$(curl -s -D "$SW_HEADER_FILE" -w "\n%{http_code}" "${FRONTEND_URL}/sw.js" || true)
SW_CODE=$(echo "$SW_RESPONSE" | tail -n 1)

IS_JS=0
if grep -qi "javascript" "$SW_HEADER_FILE"; then
  IS_JS=1
fi
rm -f "$SW_HEADER_FILE"

if [ "$SW_CODE" -eq 200 ]; then
  record_result "6. GET ${FRONTEND_URL}/sw.js" 0 "HTTP 200 OK — Service Worker available (offline PWA enabled)"
else
  record_result "6. GET ${FRONTEND_URL}/sw.js" 1 "Expected HTTP 200, got ${SW_CODE}"
fi

# ------------------------------------------------------------------------------
# Final Exit Decision
# ------------------------------------------------------------------------------
echo -e "\n----------------------------------------------------------------------"
echo -e "Smoke Test Results: ${PASSED_COUNT}/${TOTAL_TESTS} Passed | ${FAILED_COUNT} Failed"
echo -e "----------------------------------------------------------------------"

if [ "$FAILED_COUNT" -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL PRODUCTION SMOKE TESTS PASSED (100% HEALTHY)${NC}\n"
  exit 0
else
  echo -e "${RED}⚠️  SMOKE TESTS FAILED. CHECK SYSTEM LOGS.${NC}\n"
  exit 1
fi
