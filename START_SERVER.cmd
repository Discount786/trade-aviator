@echo off
cd /d "C:\Users\44777\new-project"
echo Installing dependencies...
call npm install
echo.
echo Starting server...
echo.
call npm run dev
pause





