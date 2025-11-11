#!/usr/bin/env bash
set -euo pipefail

# Tentukan warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Dapatkan directory script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}==> Menjalankan Sistem POS Restoran${NC}"
echo "    Backend API     : http://localhost:3000"
echo "    Frontend Admin  : http://localhost:5173"
echo "    Frontend Kasir  : http://localhost:5174"
echo

# Function untuk menghentikan semua proses saat exit
cleanup() {
    echo -e "\n${RED}Menghentikan semua proses...${NC}"
    pkill -f "node|vite" || true
    exit 0
}

# Tangkap signal untuk cleanup
trap cleanup SIGINT SIGTERM

# 1. Jalankan Backend
echo -e "${GREEN}==> Menjalankan Backend API${NC}"
cd server
npm run dev &
echo "    Backend API berjalan di http://localhost:3000"
sleep 2 # Tunggu server siap

# 2. Jalankan Admin Frontend
echo -e "\n${GREEN}==> Menjalankan Frontend Admin${NC}"
cd ../client_admin
npm run dev &
echo "    Frontend Admin berjalan di http://localhost:5173"
sleep 2

# 3. Jalankan Kasir Frontend
echo -e "\n${GREEN}==> Menjalankan Frontend Kasir${NC}"
cd ../client_kasir
npm run dev -- --port 5174 &
echo "    Frontend Kasir berjalan di http://localhost:5174"

echo -e "\n${BLUE}==> Semua service sudah berjalan!${NC}"
echo "    Tekan Ctrl+C untuk menghentikan semua service"

# Tunggu semua background process
wait