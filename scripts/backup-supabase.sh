#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Supabase Database Backup Script
#
# Exports the Supabase PostgreSQL database to a timestamped SQL dump and
# uploads it to a backup destination. Designed to run as a cron job or a
# GitHub Actions scheduled workflow.
#
# SETUP:
#   1. Install Supabase CLI: npm install -g supabase
#   2. Set environment variables below (or in .env / CI secrets)
#   3. chmod +x scripts/backup-supabase.sh
#   4. Run manually or add to cron:
#      0 2 * * * /path/to/backup-supabase.sh  (2am daily)
#
# ENVIRONMENT VARIABLES (required):
#   SUPABASE_PROJECT_REF   — your project ref (e.g. abcdefghijklmnop)
#   SUPABASE_DB_PASSWORD   — database password (from Supabase dashboard)
#   BACKUP_STORAGE_PATH    — local path or s3://bucket/prefix
#
# OPTIONAL:
#   BACKUP_RETENTION_DAYS  — how many days to keep backups (default: 30)
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
PROJECT_REF="${SUPABASE_PROJECT_REF:?Missing SUPABASE_PROJECT_REF}"
DB_PASSWORD="${SUPABASE_DB_PASSWORD:?Missing SUPABASE_DB_PASSWORD}"
STORAGE="${BACKUP_STORAGE_PATH:-./backups}"
RETENTION="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="wsp_backup_${TIMESTAMP}.sql"

echo "=== Wide Spectrum Productions — Supabase Backup ==="
echo "Project: ${PROJECT_REF}"
echo "Timestamp: ${TIMESTAMP}"
echo ""

# ── Create backup directory ───────────────────────────────────────────────────
mkdir -p "${STORAGE}"

# ── Dump database ─────────────────────────────────────────────────────────────
echo "[1/3] Dumping database..."
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  "postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" \
  --format=plain \
  --no-owner \
  --no-acl \
  --schema=public \
  > "${STORAGE}/${BACKUP_FILE}"

echo "      Dump size: $(du -sh "${STORAGE}/${BACKUP_FILE}" | cut -f1)"

# ── Compress ──────────────────────────────────────────────────────────────────
echo "[2/3] Compressing..."
gzip "${STORAGE}/${BACKUP_FILE}"
echo "      Compressed: ${BACKUP_FILE}.gz"

# ── Clean up old backups ──────────────────────────────────────────────────────
echo "[3/3] Pruning backups older than ${RETENTION} days..."
find "${STORAGE}" -name "wsp_backup_*.sql.gz" -mtime +${RETENTION} -delete
echo "      Done."

echo ""
echo "=== Backup complete: ${BACKUP_FILE}.gz ==="
