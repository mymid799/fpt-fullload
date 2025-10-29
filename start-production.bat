@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo  Safe Download Portal - Cần Thơ Gov
echo ========================================
echo.
echo  🏢 UBND Thành phố Cần Thơ
echo  🌐 http://safe.cantho.gov.vn:3000
echo.
echo ========================================
echo.

echo [1/4] Kiểm tra môi trường...
if not exist "backend\.env" (
    echo ❌ Thiếu file backend\.env
    echo    Vui lòng tạo file .env từ .env.example
    pause
    exit /b 1
)

if not exist "safe-download-react\.env" (
    echo ❌ Thiếu file safe-download-react\.env
    echo    Vui lòng tạo file .env từ .env.example
    pause
    exit /b 1
)

echo ✅ Files .env đã sẵn sàng
timeout /t 2 /nobreak > nul

echo.
echo [2/4] Khởi động Backend Server...
start "Backend - Safe Download (Port 5000)" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo.
echo [3/4] Khởi động Frontend...
start "Frontend - Safe Download (Port 3000)" cmd /k "cd safe-download-react && npm run dev -- --host 0.0.0.0 --port 3000"

timeout /t 3 /nobreak > nul

echo.
echo [4/4] ✅ Tất cả dịch vụ đã khởi động!
echo.
echo ========================================
echo  📡 Services Running:
echo ========================================
echo.
echo  Backend API:  http://safe.cantho.gov.vn:5000
echo  Frontend:     http://safe.cantho.gov.vn:3000
echo.
echo  Local access:
echo  - Backend:    http://localhost:5000
echo  - Frontend:   http://localhost:3000
echo.
echo ========================================
echo.
echo  💡 Nhấn Ctrl+C để dừng services
echo.
pause

