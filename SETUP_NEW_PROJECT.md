# How to Create a New Project with the Same Layout

## Step 1: Create the New Project Folder
1. Navigate to where you want your new project (e.g., `C:\Users\44777\`)
2. Create a new folder for your project (e.g., `my-new-project`)

## Step 2: Initialize Next.js Project
Open a terminal in the new folder and run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

## Step 3: Install Dependencies
```bash
npm install framer-motion three
npm install -D @types/three
```

## Step 4: Copy Configuration Files
Copy these files from your current project to the new one:
- `tsconfig.json` (already configured with path aliases)
- `tailwind.config.ts`
- `postcss.config.mjs` (if it exists)
- `next.config.js` (if it exists)

## Step 5: Create Folder Structure
Create these folders in your new project:
```
your-new-project/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
└── public/
```

## Step 6: Set Up in Cursor
1. Open Cursor
2. File → Open Folder
3. Select your new project folder
4. Cursor will automatically detect it's a Next.js project

## Step 7: Update package.json Scripts
Make sure your `package.json` has:
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start"
  }
}
```

## Step 8: Start Development Server
```bash
npm run dev
```

Your project will be available at: **http://localhost:3001**





