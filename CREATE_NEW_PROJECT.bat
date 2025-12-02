@echo off
echo Creating a new Next.js project with the same structure...
echo.

set /p PROJECT_NAME="Enter your new project name: "
set PROJECT_PATH=C:\Users\44777\%PROJECT_NAME%

echo.
echo Creating project at: %PROJECT_PATH%
echo.

mkdir "%PROJECT_PATH%"
cd "%PROJECT_PATH%"

echo Initializing Next.js project...
call npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes

echo.
echo Installing additional dependencies...
call npm install framer-motion three
call npm install -D @types/three

echo.
echo Project created successfully!
echo.
echo Next steps:
echo 1. Copy tsconfig.json, tailwind.config.ts from your current project
echo 2. Create app/globals.css, app/layout.tsx, app/page.tsx
echo 3. Create components/ folder
echo 4. Open the folder in Cursor: File -^> Open Folder
echo.
echo To start the dev server:
echo   cd %PROJECT_PATH%
echo   npm run dev
echo.
pause





