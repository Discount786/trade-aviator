@echo off
echo Checking for errors...
echo.
cd /d "C:\Users\44777\new-project"
echo Running build check...
call npm run build 2>&1 | findstr /C:"error" /C:"Error" /C:"ERROR" /C:"failed" /C:"Failed"
echo.
echo If you see errors above, those need to be fixed.
echo.
pause





