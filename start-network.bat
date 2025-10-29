@echo off
echo ========================================
echo  Safe Download Portal - Can Tho Gov
echo  Starting Backend + Frontend (Network Mode)
echo ========================================
echo.

REM Start Backend
echo [1/2] Starting Backend Server (Port 5000)...
cd backend
start "Backend Server" cmd /k "npm start"
cd ..

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend with network access
echo [2/2] Starting Frontend Server (Port 3000 - Network Access)...
cd safe-download-react
start "Frontend Server" cmd /k "npm run dev -- --host 0.0.0.0 --port 3000"
cd ..

echo.
echo ========================================
echo  ^>^> Servers are starting...
echo ========================================
echo.
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo.
echo  Network Access:
echo  - From other devices: http://YOUR_IP:3000
echo  - Example: http://192.168.1.22:3000
echo.
echo  Press any key to close this window
echo  (Servers will continue running)
echo ========================================
pause >nul

