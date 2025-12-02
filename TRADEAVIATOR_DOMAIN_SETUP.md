# Step-by-Step: Verify tradeaviator.co.uk in Resend

## Quick Steps

### 1. Add Domain to Resend
1. Go to: **https://resend.com/domains**
2. Click the **"Add Domain"** button
3. Enter: **`tradeaviator.co.uk`**
4. Click **"Add"**

### 2. Get DNS Records from Resend
After adding the domain, Resend will show you DNS records that look like this:

**TXT Record (Domain Verification):**
- Name: `@` or `tradeaviator.co.uk`
- Value: `resend-verification=xxxxx...`

**DKIM Records (3 CNAME records):**
- Name: `resend._domainkey` (or similar)
- Value: `resend._domainkey.resend.com.` (or similar)

**SPF Record (TXT):**
- Name: `@` or `tradeaviator.co.uk`
- Value: `v=spf1 include:resend.com ~all`

**DMARC Record (TXT):**
- Name: `_dmarc` or `_dmarc.tradeaviator.co.uk`
- Value: `v=DMARC1; p=none;`

### 3. Add DNS Records to Your Domain
**Where is your domain registered?**
- **GoDaddy**: Go to Domain Manager → DNS Management
- **Namecheap**: Go to Domain List → Manage → Advanced DNS
- **Cloudflare**: Go to DNS → Records
- **123-reg/IONOS**: Go to Domain Management → DNS Settings
- **Other**: Look for "DNS Management" or "DNS Settings" in your domain control panel

**Add each record:**
1. Copy the record type (TXT, CNAME, etc.)
2. Copy the Name/Host
3. Copy the Value/Target
4. Add the record in your DNS management
5. Save

### 4. Wait for Verification
- **Usually takes**: 5-30 minutes
- **Maximum**: 48 hours (rare)
- **Check status**: Go back to https://resend.com/domains
- **Status will show**: "Pending" → "Verified" ✅

### 5. Update Your .env.local File
Once verified, update your `.env.local` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_gEJ1soDY_LURDBwR9zyauCqv5ZLqkXSr3
RESEND_FROM_EMAIL=noreply@tradeaviator.co.uk
CONSULTATION_EMAIL=tradeaviatorbot@gmail.com
```

**Important**: Change `RESEND_FROM_EMAIL` from `onboarding@resend.dev` to `noreply@tradeaviator.co.uk`

### 6. Restart Your Server
```bash
# Stop the server (Ctrl+C in the terminal)
# Then restart:
npm run dev
```

### 7. Test It!
1. Go to: `http://localhost:3001/email-diagnostics`
2. Enter a test email (like `yousafali5381@gmail.com`)
3. Click "Send Test Email"
4. Check if it works! ✅

## Troubleshooting

### DNS Records Not Working?
- Wait longer (up to 48 hours)
- Check you copied the records correctly
- Make sure there are no typos
- Use https://mxtoolbox.com/ to check if DNS records are live

### Domain Still Not Verified?
- Double-check all DNS records are added
- Make sure record types match (TXT, CNAME, etc.)
- Check for typos in the record values
- Contact Resend support: support@resend.com

### Need Help Finding DNS Settings?
Tell me where you bought your domain (GoDaddy, Namecheap, etc.) and I can give you specific instructions!

## Once Verified
After your domain is verified and you've updated `.env.local`:
- ✅ You can send emails to ANY email address
- ✅ Customer confirmation emails will work
- ✅ Business notification emails will work
- ✅ All emails will come from `noreply@tradeaviator.co.uk`

