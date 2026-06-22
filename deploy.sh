#!/bin/bash
# ============================================================
# deploy.sh — Script de despliegue en VPS para Forward Vision
# Dominio: https://forwardvision.cloud
# Uso:  chmod +x deploy.sh && sudo ./deploy.sh
# ============================================================

set -e  # Salir si cualquier comando falla

DOMAIN="forwardvision.cloud"
WWW_DOMAIN="www.forwardvision.cloud"
EMAIL="admin@forwardvision.cloud"   # ← Cambia a tu email real
APP_DIR="/opt/forward-vision"
REPO_URL=""  # ← Opcional: URL de tu repositorio Git

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓] $1${NC}"; }
warn() { echo -e "${YELLOW}[!] $1${NC}"; }
info() { echo -e "${CYAN}[→] $1${NC}"; }
err()  { echo -e "${RED}[✗] $1${NC}"; exit 1; }

# ── 1. Verificar que corre como root ────────────────────────────
if [ "$EUID" -ne 0 ]; then
  err "Ejecuta este script como root: sudo ./deploy.sh"
fi

info "Iniciando despliegue de Forward Vision en $DOMAIN..."

# ── 2. Actualizar sistema e instalar dependencias ────────────────
info "Actualizando sistema..."
apt-get update -qq && apt-get upgrade -y -qq

info "Instalando Docker y Docker Compose..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  log "Docker instalado"
else
  log "Docker ya instalado: $(docker --version)"
fi

if ! command -v docker compose &> /dev/null; then
  apt-get install -y docker-compose-plugin
  log "Docker Compose instalado"
else
  log "Docker Compose ya instalado"
fi

# Certbot para SSL
if ! command -v certbot &> /dev/null; then
  apt-get install -y certbot
  log "Certbot instalado"
fi

# ── 3. Preparar directorio de la app ─────────────────────────────
info "Preparando directorio $APP_DIR..."
mkdir -p "$APP_DIR"

# Si tienes Git, clonar; si no, el usuario debe subir los archivos
if [ -n "$REPO_URL" ]; then
  if [ -d "$APP_DIR/.git" ]; then
    info "Actualizando repositorio..."
    cd "$APP_DIR" && git pull origin main
  else
    git clone "$REPO_URL" "$APP_DIR"
  fi
  log "Código actualizado desde Git"
else
  warn "REPO_URL no configurado. Asegúrate de haber copiado los archivos a $APP_DIR"
  warn "Ejemplo: scp -r ./web-forward-react/* root@tuVPS:$APP_DIR/"
fi

cd "$APP_DIR"

# ── 4. Verificar .env de producción ─────────────────────────────
if [ ! -f ".env.prod" ]; then
  err ".env.prod no encontrado. Crea el archivo con tus variables de producción primero.\nEjemplo: cp .env.prod.example .env.prod && nano .env.prod"
fi
log ".env.prod encontrado"

# ── 5. Configurar firewall ────────────────────────────────────────
info "Configurando firewall (UFW)..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
log "Firewall configurado"

# ── 6. Obtener certificado SSL (primera vez) ─────────────────────
info "Verificando certificado SSL para $DOMAIN..."

if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  info "Obteniendo certificado SSL de Let's Encrypt..."

  # Levantar nginx temporal solo en puerto 80 para verificación ACME
  docker compose -f docker-compose.prod.yml --env-file .env.prod up -d nginx 2>/dev/null || true
  sleep 5

  certbot certonly \
    --webroot \
    -w /tmp/certbot-www \
    -d "$DOMAIN" \
    -d "$WWW_DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive

  log "Certificado SSL obtenido"
else
  log "Certificado SSL ya existe, se renovará automáticamente"
fi

# ── 7. Construir y levantar los contenedores ────────────────────
info "Construyendo y levantando contenedores de producción..."

docker compose -f docker-compose.prod.yml --env-file .env.prod down --remove-orphans 2>/dev/null || true
docker compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

log "Contenedores levantados"

# ── 8. Ejecutar migraciones y seed ──────────────────────────────
info "Esperando que MySQL esté listo..."
sleep 20

info "Ejecutando migraciones de Prisma..."
docker exec fv_backend_prod npx prisma db push 2>/dev/null || \
docker exec fv_backend_prod npx prisma migrate deploy

info "Ejecutando seed inicial..."
docker exec fv_backend_prod node prisma/seed.js 2>/dev/null || \
warn "Seed ya ejecutado o falló (puede ser normal en actualizaciones)"

# ── 9. Verificar que todo funciona ──────────────────────────────
info "Verificando servicios..."
sleep 10

HEALTH=$(curl -sk "https://$DOMAIN/api/health" | grep -c '"ok"' || echo "0")
if [ "$HEALTH" -eq 1 ]; then
  log "API respondiendo correctamente en https://$DOMAIN/api/health"
else
  warn "API no responde aún. Revisa los logs: docker compose -f docker-compose.prod.yml logs backend"
fi

# ── 10. Configurar cron para renovación de SSL ──────────────────
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
  (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && docker exec fv_nginx_prod nginx -s reload") | crontab -
  log "Cron de renovación SSL configurado (3am diario)"
fi

# ── Resumen ──────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🚀 Forward Vision deployado exitosamente   ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  🌐 https://$DOMAIN              ║${NC}"
echo -e "${GREEN}║  🔌 API: https://$DOMAIN/api/health  ║${NC}"
echo -e "${GREEN}║  👤 Admin: admin@forwardvision.com        ║${NC}"
echo -e "${GREEN}║  🔑 Pass:  Admin123! (¡CAMBIA ESTO!)      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Comandos útiles:${NC}"
echo "  Ver logs:    docker compose -f docker-compose.prod.yml logs -f"
echo "  Reiniciar:   docker compose -f docker-compose.prod.yml restart"
echo "  Actualizar:  git pull && ./deploy.sh"
