# Resend Domain Verification Setup for tradeaviator.co.uk

## Problem
You're getting this error when trying to send emails:
```
You can only send testing emails to your own email address (tradeaviatorbot@gmail.com). 
To send emails to other recipients, please verify a domain at resend.com/domains, 
and change the `from` address to an email using this domain.
```

## Solution: Verify Your Domain in Resend

### Step 1: Add Domain to Resend
1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain: **`tradeaviator.co.uk`**
4. Click **"Add"**

### Step 2: Add DNS Records
Resend will show you DNS records to add. You need to add these to your domain's DNS settings:

**Example DNS Records:**
- **TXT Record** for domain verification
- **DKIM Records** (usually 3 CNAME records)
- **SPF Record** (TXT record)
- **DMARC Record** (TXT record)

**Where to add DNS records:**
- If you bought your domain from GoDaddy, Namecheap, etc., go to their DNS management
- If you're using Cloudflare, add them in the DNS section
- If you're using Vercel/Netlify, you may need to add them at your domain registrar

### Step 3: Wait for Verification
- DNS changes can take up to 48 hours to propagate
- Usually takes 5-30 minutes
- Check status in Resend dashboard - it will show "Verified" when ready

### Step 4: Update Environment Variables
Once your domain is verified:

1. Open `.env.local` in your project root
2. Update `RESEND_FROM_EMAIL` to use your verified domain:
   ```
   RESEND_FROM_EMAIL=noreply@tradeaviator.co.uk
   ```
   OR
   ```
   RESEND_FROM_EMAIL=hello@tradeaviator.co.uk
   ```
   OR
   ```
   RESEND_FROM_EMAIL=no-reply@tradeaviator.co.uk
   ```
   (Use any email address on your verified domain - the email doesn't need to exist, just the domain needs to be verified)

3. Restart your dev server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Step 5: Test
1. Go to `http://localhost:3001/email-diagnostics`
2. Enter a test email address
3. Click "Send Test Email"
4. Check if it works!

## Alternative: Use a Subdomain
If you don't have a main domain, you can:
1. Use a subdomain like `mail.tradeaviator.com`
2. Add it to Resend
3. Verify it with DNS records
4. Use `noreply@mail.tradeaviator.com` as your FROM address

## Quick Test (Without Domain)
If you need to test immediately and don't have a domain ready:
- You can only send emails to `tradeaviatorbot@gmail.com` (your Resend account email)
- This is a Resend limitation for unverified domains

## Need Help?
- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- Check your domain's DNS records: Use tools like https://mxtoolbox.com/

