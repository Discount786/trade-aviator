# Deploying Trade Aviator to Vercel

## Step 1: Prepare Your Project

### 1.1 Make sure your code is in Git
If you haven't already, initialize git and commit your code:

```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Push to GitHub (or GitLab/Bitbucket)
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Website (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up or log in (you can use your GitHub account)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select your repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add these:

   ```
   RESEND_API_KEY=your_resend_api_key_here
   RESEND_FROM_EMAIL=noreply@tradeaviator.co.uk
   CONSULTATION_EMAIL=tradeaviatorbot@gmail.com
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   NEXT_PUBLIC_BASE_URL=https://your-vercel-url.vercel.app
   ```

   **Important Notes:**
   - Replace `STRIPE_WEBHOOK_SECRET` with your actual webhook secret (get it from Stripe Dashboard)
   - Replace `NEXT_PUBLIC_BASE_URL` with your actual Vercel URL after first deployment
   - Make sure to add these for **Production**, **Preview**, and **Development** environments

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your site will be live at: `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - It will ask you to link to an existing project or create a new one
   - It will detect your environment variables from `.env.local` (but you should still add them in Vercel dashboard)

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Your Domain

### 3.1 Add Custom Domain in Vercel
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your domain: `tradeaviator.co.uk`
4. Follow Vercel's instructions to add DNS records

### 3.2 Update Environment Variables
After adding your domain, update:
```
NEXT_PUBLIC_BASE_URL=https://tradeaviator.co.uk
```

## Step 4: Configure Stripe Webhook

### 4.1 Get Your Webhook URL
After deployment, your webhook URL will be:
```
https://tradeaviator.co.uk/api/webhooks/stripe
```
OR
```
https://your-project-name.vercel.app/api/webhooks/stripe
```

### 4.2 Add Webhook in Stripe Dashboard
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL
4. Select events to listen for:
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

### 4.3 Test Webhook
- Make a test purchase
- Check Stripe Dashboard → Webhooks → Your endpoint → Recent events
- Should show successful delivery

## Step 5: Verify Everything Works

### 5.1 Test Email Sending
1. Go to: `https://tradeaviator.co.uk/email-diagnostics`
2. Send a test email
3. Check if it works

### 5.2 Test Payment Flow
1. Make a test purchase
2. Check if:
   - Stripe checkout works
   - Customer receives confirmation email
   - You receive business notification email
   - Webhook processes successfully

## Important Notes

### Environment Variables Security
- ✅ **DO** add environment variables in Vercel Dashboard
- ❌ **DON'T** commit `.env.local` to Git (it's in `.gitignore`)
- ✅ **DO** use Vercel's environment variable settings

### Build Settings
- Vercel auto-detects Next.js projects
- No special build configuration needed
- Make sure `package.json` has the correct scripts

### Database/Storage
- Your project uses localStorage (client-side only)
- For production, consider using a database for cart persistence
- Currently, cart is stored in browser localStorage

### Performance
- Vercel automatically optimizes Next.js apps
- Images are optimized automatically
- Static assets are CDN-cached

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Make sure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally first

### Environment Variables Not Working
- Make sure they're added in Vercel Dashboard
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Webhook Not Working
- Verify webhook URL is correct
- Check webhook secret matches
- Test webhook in Stripe Dashboard
- Check Vercel function logs

### Emails Not Sending
- Verify domain is verified in Resend
- Check `RESEND_FROM_EMAIL` uses verified domain
- Check Resend dashboard for delivery status

## Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Set up custom domain
3. ✅ Configure Stripe webhook
4. ✅ Test email delivery
5. ✅ Monitor Vercel Analytics
6. ✅ Set up error monitoring (optional)

## Support
- Vercel Docs: https://vercel.com/docs
- Vercel Support: support@vercel.com
- Your project is now live! 🚀

