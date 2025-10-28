@echo off
echo Starting Backend and Frontend on all network interfaces...

echo.
echo Starting Backend on 0.0.0.0:5000...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend on 0.0.0.0:3000...
start "Frontend Server" cmd /k "cd safe-download-react && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://0.0.0.0:5000
echo Frontend: http://0.0.0.0:3000
echo.
echo Press any key to exit...
pause > nul
