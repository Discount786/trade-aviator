@echo off
echo ========================================
echo   SETTING UP IMAGES FOR RESULTS SECTION
echo ========================================
echo.
echo This will copy your images from Downloads to the public folder.
echo.
echo Looking for images 5, 6, 7, 8, 9, 10 in Downloads...
echo.

cd /d "%~dp0"

if not exist "public" mkdir public

echo Copying images...
echo.

REM Try to find and copy image 5
for %%f in ("C:\Users\44777\Downloads\5.*" "C:\Users\44777\Downloads\Image (5).*" "C:\Users\44777\Downloads\Screenshot (5).*") do (
    if exist "%%f" (
        copy /Y "%%f" "public\trading1.*" >nul 2>&1
        echo [OK] Image 5 found and copied as trading1
        goto :found5
    )
)
echo [NOT FOUND] Image 5 - please manually copy and rename it as trading1.jpg
:found5

REM Try to find and copy image 6
for %%f in ("C:\Users\44777\Downloads\6.*" "C:\Users\44777\Downloads\Image (6).*" "C:\Users\44777\Downloads\Screenshot (6).*") do (
    if exist "%%f" (
        copy /Y "%%f" "public\trading2.*" >nul 2>&1
        echo [OK] Image 6 found and copied as trading2
        goto :found6
    )
)
echo [NOT FOUND] Image 6 - please manually copy and rename it as trading2.jpg
:found6

REM Try to find and copy image 7
for %%f in ("C:\Users\44777\Downloads\7.*" "C:\Users\44777\Downloads\Image (7).*" "C:\Users\44777\Downloads\Screenshot (7).*") do (
    if exist "%%f" (
        copy /Y "%%f" "public\trading3.*" >nul 2>&1
        echo [OK] Image 7 found and copied as trading3
        goto :found7
    )
)
echo [NOT FOUND] Image 7 - please manually copy and rename it as trading3.jpg
:found7

REM Try to find and copy image 8
for %%f in ("C:\Users\44777\Downloads\8.*" "C:\Users\44777\Downloads\Image (8).*" "C:\Users\44777\Downloads\Screenshot (8).*") do (
    if exist "%%f" (
        copy /Y "%%f" "public\chat1.*" >nul 2>&1
        echo [OK] Image 8 found and copied as chat1
        goto :found8
    )
)
echo [NOT FOUND] Image 8 - please manually copy and rename it as chat1.jpg
:found8

REM Try to find and copy image 9
for %%f in ("C:\Users\44777\Downloads\9.*" "C:\Users\44777\Downloads\Image (9).*" "C:\Users\44777\Downloads\Screenshot (9).*") do (
    if exist "%%f" (
        copy /Y "%%f" "public\chat2.*" >nul 2>&1
        echo [OK] Image 9 found and copied as chat2
        goto :found9
    )
)
echo [NOT FOUND] Image 9 - please manually copy and rename it as chat2.jpg
:found9

REM Try to find and copy image 10
for %%f in ("C:\Users\44777\Downloads\10.*" "C:\Users\44777\Downloads\Image (10).*" "C:\Users\44777\Downloads\Screenshot (10).*") do (
    if exist "%%f" (
        copy /Y "%%f" "public\chat3.*" >nul 2>&1
        echo [OK] Image 10 found and copied as chat3
        goto :found10
    )
)
echo [NOT FOUND] Image 10 - please manually copy and rename it as chat3.jpg
:found10

echo.
echo ========================================
echo   MANUAL INSTRUCTIONS (if images not found)
echo ========================================
echo.
echo 1. Open File Explorer
echo 2. Go to: C:\Users\44777\Downloads
echo 3. Find your images 5, 6, 7, 8, 9, 10
echo 4. Copy them to: C:\Users\44777\new-project\public\
echo 5. Rename them:
echo    - Image 5 -> trading1.jpg (or .png)
echo    - Image 6 -> trading2.jpg (or .png)
echo    - Image 7 -> trading3.jpg (or .png)
echo    - Image 8 -> chat1.jpg (or .png)
echo    - Image 9 -> chat2.jpg (or .png)
echo    - Image 10 -> chat3.jpg (or .png)
echo.
pause





