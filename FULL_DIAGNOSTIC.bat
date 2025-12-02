@echo off
cls
echo ========================================
echo   FULL DIAGNOSTIC - Trade Aviator
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Checking Node.js installation...
node --version 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is NOT installed!
    echo Please install from: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found
echo.

echo [2/5] Checking npm installation...
npm --version 2>nul
if errorlevel 1 (
    echo [ERROR] npm is NOT installed!
    pause
    exit /b 1
)
echo [OK] npm found
echo.

echo [3/5] Checking if dependencies are installed...
if not exist "node_modules\next" (
    echo [WARNING] Dependencies missing! Installing now...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies installed
)
echo.

echo [4/5] Checking port 3001...
netstat -ano | findstr :3001 >nul
if not errorlevel 1 (
    echo [WARNING] Port 3001 is already in use!
    echo Trying port 3002 instead...
    set PORT=3002
) else (
    echo [OK] Port 3001 is available
    set PORT=3001
)
echo.

echo [5/5] Starting development server...
echo.
echo ========================================
echo   SERVER STARTING...
echo ========================================
echo.
echo URL: http://localhost:%PORT%
echo.
echo Keep this window open!
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

if "%PORT%"=="3002" (
    npm run dev -- -p 3002
) else (
    npm run dev
)

pause





