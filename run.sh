#!/usr/bin/env bash

# Lightweight launcher for backend and both frontends
# Starts:
#  - server (assumes runs on 5001)
#  - client_admin (Vite default 5173)
#  - client_kasir (Vite on 5174)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR" || exit 1

echo -e "${BLUE}==> Menjalankan POS (server + admin + kasir)${NC}"

cleanup() {
    echo -e "\n${RED}Menghentikan semua proses...${NC}"
    if command -v pkill >/dev/null 2>&1; then
        pkill -f "node" >/dev/null 2>&1 || true
        pkill -f "vite" >/dev/null 2>&1 || true
    else
        # Fallback: kill by PID variables if available
        [[ -n "$BACKEND_PID" ]] && kill "$BACKEND_PID" 2>/dev/null || true
        [[ -n "$ADMIN_PID" ]] && kill "$ADMIN_PID" 2>/dev/null || true
        [[ -n "$KASIR_PID" ]] && kill "$KASIR_PID" 2>/dev/null || true
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# 1) Backend
echo -e "${GREEN}==> Menjalankan Backend API${NC}"
cd "$SCRIPT_DIR/server" || exit 1
npm run dev &
BACKEND_PID=$!
echo " Backend API berjalan di http://localhost:5001 (PID: $BACKEND_PID)"
sleep 1

# 2) Frontend Admin
echo -e "\n${GREEN}==> Menjalankan Frontend Admin${NC}"
cd "$SCRIPT_DIR/client_admin" || exit 1
npm run dev &
ADMIN_PID=$!
echo " Frontend Admin berjalan di http://localhost:5173 (PID: $ADMIN_PID)"
sleep 1

# 3) Frontend Kasir
echo -e "\n${GREEN}==> Menjalankan Frontend Kasir${NC}"
cd "$SCRIPT_DIR/client_kasir" || exit 1
# pass explicit port to Vite
npm run dev -- --port 5174 &
KASIR_PID=$!
echo " Frontend Kasir berjalan di http://localhost:5174 (PID: $KASIR_PID)"

echo -e "\n${BLUE}==> Semua service sudah berjalan!${NC}"
echo " Tekan Ctrl+C untuk menghentikan semua service"

wait
