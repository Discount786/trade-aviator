@echo off
cls
echo ========================================
echo Starting Trade Aviator Website
echo ========================================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Step 1: Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo.

echo Step 2: Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing dependencies, this may take a minute...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)
echo.

echo Step 3: Starting development server...
echo.
echo The server will start on http://localhost:3001
echo.
echo IMPORTANT: Keep this window open while using the website!
echo.
echo ========================================
echo.

call npm run dev

pause





