# Aureco - Vercel + Supabase Deployment Guide

## 🎯 **What You Have Now:**
- ✅ React frontend ready for Vercel
- ✅ Supabase integration for database + backend
- ✅ Contact form with email sending
- ✅ All 10 products with real images
- ✅ WhatsApp integration
- ✅ Responsive design

---

## 📋 **Prerequisites:**

1. **Domain** - e.g., `aureco.com` (buy from Namecheap, GoDaddy, etc.)
2. **Supabase Account** - Sign up at https://supabase.com (FREE)
3. **Vercel Account** - Sign up at https://vercel.com (FREE)
4. **GitHub Account** - To store code (optional but recommended)

---

## 🚀 **Step-by-Step Deployment:**

### **STEP 1: Set Up Supabase (5 minutes)**

#### 1.1 Create Project
1. Go to https://supabase.com
2. Click **New Project**
3. Fill in:
   - **Name:** Aureco
   - **Database Password:** (create a strong password - save it!)
   - **Region:** Choose closest to your customers (Asia South for India)
4. Click **Create new project** (takes 1-2 minutes)

#### 1.2 Create Database Table
1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the SQL from `/app/SUPABASE_SETUP.md` file
4. Click **Run** to create the `contact_submissions` table

#### 1.3 Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJh...`)

#### 1.4 Set Up Email Function (Optional but Recommended)
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your project:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. Deploy the email function:
   ```bash
   supabase functions deploy send-contact-email --no-verify-jwt
   ```

4. Set environment variable:
   ```bash
   supabase secrets set RESEND_API_KEY=re_Fk8yQTKf_77GYwmKdMaZhGK5W91RL8HJd
   ```

---

### **STEP 2: Prepare Code for Vercel (2 minutes)**

#### 2.1 Update Environment Variables
Create file: `/app/frontend/.env.production`

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJh...your-anon-key
```

Replace with your actual Supabase credentials from Step 1.3.

#### 2.2 Create `vercel.json` Configuration
Already created at `/app/frontend/vercel.json`:
```json
{
  "buildCommand": "yarn build",
  "outputDirectory": "build",
  "devCommand": "yarn start",
  "installCommand": "yarn install"
}
```

---

### **STEP 3: Deploy to Vercel (5 minutes)**

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click **Add New** → **Project**

2. **Import Repository:**
   - If using GitHub: Connect your GitHub account
   - Select the repository with your Aureco code
   - If no GitHub: Use **Deploy from CLI** (see Option B)

3. **Configure Project:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`

4. **Add Environment Variables:**
   Click **Environment Variables** and add:
   - `REACT_APP_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY` = `eyJh...your-key`

5. **Deploy:**
   - Click **Deploy**
   - Wait 2-3 minutes
   - Your site will be live at: `https://aureco.vercel.app`

#### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Go to frontend folder
cd /app/frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? aureco
# - In which directory is your code located? ./
# - Want to override the settings? No

# Deploy to production
vercel --prod
```

---

### **STEP 4: Connect Custom Domain (3 minutes)**

1. **In Vercel Dashboard:**
   - Go to your project → **Settings** → **Domains**
   - Add your domain: `aureco.com`
   - Also add: `www.aureco.com`

2. **In Your Domain Registrar (Namecheap/GoDaddy):**
   - Go to DNS Settings
   - Add these records:

   **For root domain (aureco.com):**
   ```
   Type: A
   Host: @
   Value: 76.76.21.21
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation:**
   - Takes 5 minutes to 24 hours (usually ~10 minutes)
   - Vercel will auto-provision SSL certificate

4. **Verify:**
   - Visit `https://aureco.com`
   - Should see your site with SSL (🔒)

---

### **STEP 5: Verify Everything Works (2 minutes)**

#### Test Contact Form:
1. Go to your website
2. Fill out contact form
3. Click "Send Enquiry"
4. Check:
   - ✅ Success toast appears
   - ✅ Data in Supabase (Table Editor → `contact_submissions`)
   - ✅ Email received at dhairya2143@gmail.com

#### Test WhatsApp:
1. Click WhatsApp button
2. Verify it opens WhatsApp with correct number

#### Test Products:
1. Scroll through product carousel
2. Click on product cards
3. Verify modals open correctly

---

## 💰 **Total Costs:**

| Service | Cost | What For |
|---------|------|----------|
| **Domain** | $10-15/year | aureco.com |
| **Supabase** | FREE | Database + Backend (up to 500MB DB, 2GB bandwidth) |
| **Vercel** | FREE | Hosting (100GB bandwidth, unlimited sites) |
| **Resend Email** | FREE | 100 emails/day, 3,000/month |
| **SSL Certificate** | FREE | Auto-provisioned |
| **Total Year 1** | **$10-15** | Just domain cost! |

---

## 📈 **When You Outgrow Free Tiers:**

### Supabase Pro ($25/month):
- 8GB database
- 100GB bandwidth
- Better performance

### Vercel Pro ($20/month):
- 1TB bandwidth
- Better analytics
- Priority support

### Resend Pro ($20/month):
- 50,000 emails/month
- Custom domains

**But for now, FREE tier is more than enough!**

---

## 🔧 **Post-Deployment Tasks:**

### 1. Fix Email Domain (When Ready)
Once you verify your domain with Resend:
```typescript
// In supabase/functions/send-contact-email/index.ts
const BUSINESS_EMAIL = 'aurecopackaging@gmail.com' // Update this
```
Then redeploy the function.

### 2. Set Up Email Forwarding (Immediate)
In Gmail (dhairya2143@gmail.com):
- Settings → Forwarding
- Add: aurecopackaging@gmail.com
- Auto-forward all emails with "Aureco" in subject

### 3. Monitor Submissions
- Go to Supabase Dashboard → Table Editor → `contact_submissions`
- Or set up email notifications for new rows

### 4. Add Google Analytics (Optional)
1. Create GA4 property
2. Add tracking code to `/app/frontend/public/index.html`

---

## 🆘 **Troubleshooting:**

### Contact Form Not Working:
- Check Supabase credentials in Vercel env vars
- Verify table `contact_submissions` exists
- Check Supabase logs (Logs → Edge Functions)

### Domain Not Connecting:
- Wait longer (DNS takes time)
- Verify DNS records are correct
- Check Vercel domain status

### Email Not Sending:
- Check Resend API key in Supabase secrets
- Verify Edge Function is deployed
- Check function logs in Supabase

---

## 📞 **Need Help?**

Just ask me! I can help you with:
- Deploying to Vercel
- Setting up Supabase
- Connecting domain
- Troubleshooting issues
- Adding new features

---

## ✅ **Deployment Checklist:**

- [ ] Supabase project created
- [ ] Database table created
- [ ] Supabase credentials obtained
- [ ] Code pushed to GitHub (optional)
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Site deployed to Vercel
- [ ] Custom domain added
- [ ] DNS records configured
- [ ] SSL certificate provisioned
- [ ] Contact form tested
- [ ] Email delivery verified
- [ ] WhatsApp tested
- [ ] Mobile responsive checked

---

**Ready to deploy? Let me know if you need help with any step!** 🚀
