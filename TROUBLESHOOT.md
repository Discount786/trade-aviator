# Troubleshooting Steps

## Step 1: Open PowerShell in the project folder
1. Press Windows Key + R
2. Type: `powershell`
3. Press Enter
4. Type: `cd C:\Users\44777\new-project`
5. Press Enter

## Step 2: Install dependencies
Type: `npm install`
Wait for it to finish

## Step 3: Start the server
Type: `npm run dev`
Wait for it to say "Ready"

## Step 4: Open browser
Go to: http://localhost:3001

## If you see errors:
- Copy the error message
- Check if port 3001 is already in use
- Try: `npm run dev -- -p 3002` to use a different port

## Test page:
If main page doesn't work, try: http://localhost:3001/test





