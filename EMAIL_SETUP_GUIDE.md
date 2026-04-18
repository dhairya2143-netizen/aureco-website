# Aureco Email Setup Guide

## Current Status
✅ **Email integration is working!**
- Test emails are being sent to: **dhairya2143@gmail.com**
- Form submissions are successfully captured and delivered

## Why emails go to dhairya2143@gmail.com instead of aurecopackaging@gmail.com

Resend (our email service) has a **testing mode** that only allows sending to the email address used during signup. To send to **aurecopackaging@gmail.com**, you need to verify a domain.

---

## Option 1: Forward Emails (Quick Setup - 2 minutes)

**Easiest solution:** Set up email forwarding from dhairya2143@gmail.com to aurecopackaging@gmail.com

### Steps:
1. Log in to **dhairya2143@gmail.com**
2. Go to **Settings** → **Forwarding and POP/IMAP**
3. Click **Add a forwarding address**
4. Enter: **aurecopackaging@gmail.com**
5. Verify the forwarding address
6. Set up a filter to automatically forward emails with subject containing "Aureco" or "Quote Request"

**Result:** All contact form submissions will automatically arrive at aurecopackaging@gmail.com

---

## Option 2: Verify Domain (Production Setup - 15 minutes)

**For professional setup:** Verify a domain with Resend to send directly to aurecopackaging@gmail.com

### Steps:

#### 1. Get a Domain
- If you don't have one, register a domain (e.g., `aureco.com`) from:
  - Namecheap.com
  - GoDaddy.com
  - Google Domains

#### 2. Verify Domain with Resend
1. Log in to https://resend.com (use dhairya2143@gmail.com account)
2. Go to **Domains** → **Add Domain**
3. Enter your domain (e.g., `aureco.com`)
4. Resend will provide DNS records to add

#### 3. Add DNS Records
Go to your domain registrar (where you bought the domain) and add these DNS records:
- **SPF Record** (TXT)
- **DKIM Record** (TXT)  
- **MX Record** (optional, for receiving replies)

#### 4. Update Backend Configuration
Once domain is verified, update `/app/backend/.env`:
```bash
SENDER_EMAIL=hello@aureco.com
BUSINESS_EMAIL=aurecopackaging@gmail.com
```

#### 5. Restart Backend
```bash
sudo supervisorctl restart backend
```

**Result:** Emails will be sent from `hello@aureco.com` to `aurecopackaging@gmail.com` with full deliverability

---

## Option 3: Alternative Email Services

If you prefer not to use Resend, here are alternatives:

### A. Gmail SMTP (Free, but less reliable for contact forms)
- Use Gmail's SMTP server directly
- Requires app-specific password
- May have daily sending limits

### B. SendGrid (Free tier: 100 emails/day)
- Similar to Resend
- Also requires domain verification for production

### C. Mailgun (Free tier available)
- More complex setup
- Good deliverability

---

## Current Configuration

**File:** `/app/backend/.env`
```env
RESEND_API_KEY=re_Fk8yQTKf_77GYwmKdMaZhGK5W91RL8HJd
SENDER_EMAIL=onboarding@resend.dev
BUSINESS_EMAIL=dhairya2143@gmail.com
```

**Where form submissions go:** dhairya2143@gmail.com

---

## Testing the Form

Visit: https://wrapped-intent.preview.emergentagent.com

1. Scroll to **Contact** section
2. Fill out the quote request form
3. Submit
4. Check **dhairya2143@gmail.com** inbox for the email

---

## Recommendation

**For immediate use:** Choose **Option 1 (Email Forwarding)** - takes 2 minutes and works immediately.

**For long-term:** Choose **Option 2 (Domain Verification)** when you register a domain for Aureco.

---

## Need Help?

If you need assistance setting up:
1. Domain verification
2. Email forwarding
3. Alternative email service

Just ask! I can guide you through any of these options.
