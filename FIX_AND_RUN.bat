@echo off
echo ========================================
echo Fixing PowerShell and Starting Server
echo ========================================
echo.

cd /d "C:\Users\44777\new-project"

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting development server...
echo.
echo The server will start on http://localhost:3001
echo Keep this window open!
echo.
call npm run dev

pause





