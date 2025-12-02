# Deployment Guide - Make Your Website Live

## Option 1: Vercel (Recommended - Easiest for Next.js)

Vercel is made by the creators of Next.js and offers free hosting with automatic deployments.

### Step 1: Create a Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub, GitLab, or Bitbucket (or email)

### Step 2: Install Vercel CLI (Optional - for command line deployment)
```bash
npm install -g vercel
```

### Step 3: Deploy via Vercel Dashboard

**Method A: Deploy via GitHub (Recommended)**
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add Environment Variables:
   - `RESEND_API_KEY` = `re_gEJ1soDY_LURDBwR9zyauCqv5ZLqkXSr3`
   - `CONSULTATION_EMAIL` = `tradeaviatorbot@gmail.com`
   - `RESEND_FROM_EMAIL` = `onboarding@resend.dev`
6. Click "Deploy"
7. Your site will be live in 2-3 minutes!

**Method B: Deploy via Vercel CLI**
1. In your project folder, run:
   ```bash
   vercel
   ```
2. Follow the prompts
3. When asked about environment variables, add:
   - `RESEND_API_KEY`
   - `CONSULTATION_EMAIL`
   - `RESEND_FROM_EMAIL`
4. Your site will be deployed!

### Step 4: Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

---

## Option 2: Netlify

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Sign up for free

### Step 2: Deploy
1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables in Site settings
4. Deploy!

---

## Option 3: Google Cloud Platform / Firebase

### Using Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize:
   ```bash
   firebase init hosting
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

## Important: Environment Variables

**Before deploying, make sure to add these environment variables on your hosting platform:**

1. `RESEND_API_KEY` = `re_gEJ1soDY_LURDBwR9zyauCqv5ZLqkXSr3`
2. `CONSULTATION_EMAIL` = `tradeaviatorbot@gmail.com`
3. `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

### Where to add on Vercel:
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable
4. Redeploy

---

## Quick Start (Vercel - Fastest Method)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add environment variables:**
   - Go to Vercel dashboard
   - Your project → Settings → Environment Variables
   - Add the 3 variables listed above

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

Your site will be live at: `https://your-project-name.vercel.app`

---

## Troubleshooting

- **Build errors?** Check that all dependencies are in `package.json`
- **Environment variables not working?** Make sure they're added in the hosting platform's dashboard
- **Email not sending?** Verify Resend API key is correct in environment variables

---

## Need Help?

If you need help with any step, let me know which hosting platform you want to use and I can guide you through it!

