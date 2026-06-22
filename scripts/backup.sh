#!/bin/bash
# ============================================================
# backup.sh — Backup automático de MySQL para Forward Vision
# Configurar como cron:
#   crontab -e
#   0 2 * * * /opt/forward-vision/scripts/backup.sh >> /var/log/fv-backup.log 2>&1
# ============================================================

set -e

BACKUP_DIR="/opt/backups/forward-vision"
CONTAINER="fv_db_prod"
DB_NAME="${DB_NAME:-forwardvision_db}"
DB_USER="${DB_USER:-fv_user}"
DB_PASS="${DB_PASSWORD:-fv_secret}"
KEEP_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
FILE="$BACKUP_DIR/db_$DATE.sql.gz"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Iniciando backup..."

mkdir -p "$BACKUP_DIR"

# Dump + comprimir
docker exec "$CONTAINER" \
  mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" \
  --single-transaction \
  --routines \
  --triggers | gzip > "$FILE"

SIZE=$(du -sh "$FILE" | cut -f1)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Backup creado: $FILE ($SIZE)"

# Eliminar backups más viejos de 30 días
DELETED=$(find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime "+$KEEP_DAYS" -delete -print | wc -l)
if [ "$DELETED" -gt 0 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🗑️  $DELETED backup(s) antiguos eliminados"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup completado."
