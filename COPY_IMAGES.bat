@echo off
echo Copying images from Downloads to public folder...
echo.

cd /d "%~dp0"

echo Looking for images 5, 6, 7, 8, 9, 10 in Downloads...
echo.

copy /Y "C:\Users\44777\Downloads\5.*" "public\trading1.*" >nul 2>&1
if exist "public\trading1.*" (
    echo [OK] Image 5 copied as trading1
) else (
    echo [NOT FOUND] Image 5 - please check the filename
)

copy /Y "C:\Users\44777\Downloads\6.*" "public\trading2.*" >nul 2>&1
if exist "public\trading2.*" (
    echo [OK] Image 6 copied as trading2
) else (
    echo [NOT FOUND] Image 6 - please check the filename
)

copy /Y "C:\Users\44777\Downloads\7.*" "public\trading3.*" >nul 2>&1
if exist "public\trading3.*" (
    echo [OK] Image 7 copied as trading3
) else (
    echo [NOT FOUND] Image 7 - please check the filename
)

copy /Y "C:\Users\44777\Downloads\8.*" "public\chat1.*" >nul 2>&1
if exist "public\chat1.*" (
    echo [OK] Image 8 copied as chat1
) else (
    echo [NOT FOUND] Image 8 - please check the filename
)

copy /Y "C:\Users\44777\Downloads\9.*" "public\chat2.*" >nul 2>&1
if exist "public\chat2.*" (
    echo [OK] Image 9 copied as chat2
) else (
    echo [NOT FOUND] Image 9 - please check the filename
)

copy /Y "C:\Users\44777\Downloads\10.*" "public\chat3.*" >nul 2>&1
if exist "public\chat3.*" (
    echo [OK] Image 10 copied as chat3
) else (
    echo [NOT FOUND] Image 10 - please check the filename
)

echo.
echo Done! Please check the messages above.
echo If some images weren't found, you may need to rename them or check the exact filenames.
echo.
pause





