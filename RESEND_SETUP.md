# Resend Email Setup Instructions

## Step 1: Create a Resend Account
1. Go to https://resend.com
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

## Step 2: Get Your API Key
1. Log in to Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Trade Aviator")
5. Copy the API key (starts with `re_`)

## Step 3: Set Up Environment Variables
1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.local.example`
3. Replace the values:
   - `RESEND_API_KEY`: Paste your Resend API key
   - `CONSULTATION_EMAIL`: Your email address where you want to receive notifications
   - `RESEND_FROM_EMAIL`: 
     - For testing: Use `onboarding@resend.dev` (already set)
     - For production: Use your verified domain email (e.g., `noreply@yourdomain.com`)

## Step 4: Verify Your Domain (Optional - for production)
If you want to use your own domain email:
1. In Resend dashboard, go to **Domains**
2. Add your domain
3. Add the DNS records they provide
4. Wait for verification
5. Update `RESEND_FROM_EMAIL` in `.env.local` to use your domain

## Step 5: Restart Your Server
After setting up `.env.local`, restart your Next.js server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing
1. Fill out the consultation form on your website
2. Submit it
3. Check your email inbox for the notification
4. Also check the server console for logs

## Troubleshooting
- **No emails received?** Check your spam folder
- **API key error?** Make sure `.env.local` is in the project root (same folder as `package.json`)
- **Server not reading env vars?** Restart the server after creating/updating `.env.local`

