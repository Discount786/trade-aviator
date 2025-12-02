# Stripe Webhook Setup Guide

This guide will help you set up Stripe webhooks to send automated emails after successful payments.

## What This Does

When a customer completes a payment via Stripe:
1. ✅ Customer receives a confirmation email with order details
2. ✅ You receive a notification email with payment information

## Setup Instructions

### Step 1: Get Your Webhook Endpoint URL

**For Local Development:**
- Use a tool like [ngrok](https://ngrok.com/) or [Stripe CLI](https://stripe.com/docs/stripe-cli) to expose your local server
- Your webhook URL will be: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`

**For Production (Vercel/Deployed):**
- Your webhook URL will be: `https://yourdomain.com/api/webhooks/stripe`

### Step 2: Create Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL (from Step 1)
4. Select the event to listen for: **`checkout.session.completed`**
5. Click **"Add endpoint"**

### Step 3: Get Your Webhook Secret

1. After creating the webhook, click on it in the dashboard
2. Find the **"Signing secret"** (starts with `whsec_...`)
3. Copy this secret

### Step 4: Add Webhook Secret to Environment Variables

Add this to your `.env.local` file:

```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Important:** 
- For production, add this to your hosting platform's environment variables (Vercel, etc.)
- Never commit this secret to GitHub

### Step 5: Restart Your Server

Restart your dev server to load the new environment variable:

```bash
npm run dev
```

## Testing Webhooks Locally

### Option 1: Using Stripe CLI (Recommended)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```
4. The CLI will show you a webhook signing secret - use this in your `.env.local`

### Option 2: Using ngrok

1. Install ngrok: https://ngrok.com/
2. Start your dev server: `npm run dev`
3. In another terminal, run: `ngrok http 3001`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. In Stripe Dashboard, create webhook with URL: `https://abc123.ngrok.io/api/webhooks/stripe`

## Testing

1. Make a test payment on your site
2. Check your email inbox (customer email and business email)
3. Check Stripe Dashboard → Webhooks → Your endpoint → Recent events

## Troubleshooting

- **Webhook not receiving events?** Check that the URL is correct and accessible
- **Signature verification failing?** Make sure `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe Dashboard
- **Emails not sending?** Check that `RESEND_API_KEY` and `CONSULTATION_EMAIL` are set correctly

## Security Note

⚠️ **Important:** Always verify webhook signatures in production! The webhook handler will skip verification if `STRIPE_WEBHOOK_SECRET` is not set (development mode only).

