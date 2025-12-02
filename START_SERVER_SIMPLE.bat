@echo off
title Trade Aviator Server
color 0A
echo.
echo ==========================================
echo   STARTING TRADE AVIATOR SERVER
echo ==========================================
echo.
echo Please wait while the server starts...
echo.
echo Once you see "Ready" below, go to:
echo http://localhost:3001
echo.
echo DO NOT CLOSE THIS WINDOW!
echo.
echo ==========================================
echo.

cd /d "%~dp0"

echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from nodejs.org
    pause
    exit
)

echo Node.js found!
echo.
echo Installing dependencies (if needed)...
call npm install >nul 2>&1

echo Starting server...
echo.
npm run dev

pause





