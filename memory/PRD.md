# Aureco - Premium Packaging Solutions Website
## Product Requirements Document

**Project Type:** B2B Marketing Website  
**Target Audience:** Fashion designers, clothing brands, boutique retailers  
**Last Updated:** December 2025

---

## Original Problem Statement

Build a premium, scroll-driven B2B website for Aureco — a packaging solutions company serving fashion designers and clothing brands. The website should feel like a luxury sustainable brand with warm, earthy, editorial aesthetic (Aesop meets Patagonia style).

### User Choices & Requirements

1. **Contact Form:** Email integration (Resend API)
2. **Product Layout:** Horizontal scroll carousel
3. **Form Dropdown:** Combined (all 6 product types + generic options)
4. **Implementation:** Frontend-first with mock data
5. **Additional Features:** 
   - WhatsApp integration for quick enquiries
   - Image gallery/modals for products

---

## Brand Identity

**Colors:**
- Primary: PANTONE 17-0332 TCX "Spindle Tree" (#6B8E3E - olive/moss green)
- Secondary: Off-white / natural cotton (#F5F0E8)
- Text: Deep charcoal (#1C1C1A)

**Typography:**
- Headings: Playfair Display (serif) - elegant, editorial
- Body: DM Sans (sans-serif) - clean, readable

**Design Principles:**
- Generous whitespace (2-3x more than typical)
- Warm, earthy, editorial aesthetic
- Scroll-triggered animations
- Parallax effects
- Premium, tactile feel
- No dark colorful gradients
- No purple/pink combinations

---

## What's Been Implemented (Phase 1 - Frontend MVP)

**Date:** December 2025

### ✅ Completed Features

1. **Loading Animation**
   - Aureco logo fade-in/fade-out (2 seconds)
   - Smooth transition to hero section
   - Brand color integration

2. **Navigation**
   - Fixed navbar with scroll detection
   - Smooth scroll to sections
   - Mobile-responsive hamburger menu
   - "Get a Quote" CTA button

3. **Hero Section**
   - Full-screen layout with background image
   - Overlay with brand colors
   - Animated headline and subheadline
   - Parallax background effect
   - CTA button linking to contact form

4. **About Section**
   - Two-column grid layout
   - Left: Editorial text with scroll animations
   - Right: High-quality image with parallax
   - Intersection Observer for reveal animations

5. **Products Section ("What We Make")**
   - Horizontal scroll carousel
   - 6 product cards:
     - Woven Care Labels
     - Hang Tags
     - Tissue Wrapping Paper
     - Paper Bags
     - Jute Bags
     - Branded Inserts
   - Click-to-view gallery modal
   - Staggered entrance animations
   - Hover effects with lift and shadow

6. **Product Gallery Modal**
   - Full-screen overlay with image
   - Product details and description
   - "Request a Quote" CTA
   - Smooth open/close animations
   - Click outside to close

7. **Industries Section**
   - Dark charcoal background (#1C1C1A)
   - Three industry cards:
     - Fashion Designers
     - Clothing Brands
     - Boutique Retailers
   - Icon-based design
   - Staggered left-to-right animations

8. **Contact Form**
   - Fields: Name, Brand/Company, Email, Type of Packaging Needed, Message
   - Dropdown with all 6 products + generic options (9 total)
   - Form validation
   - Success toast notification (using Sonner)
   - Currently using MOCK data (form submission logged to console)
   - Beautiful animations on scroll

9. **Footer**
   - Brand logo and tagline
   - Navigation links
   - Contact information (email, phone)
   - Green horizontal divider
   - Copyright notice

10. **WhatsApp Integration**
    - Fixed floating button (bottom-right)
    - Popup with "Chat with us" message
    - Opens WhatsApp with pre-filled message
    - Green branding consistent with site

11. **Responsive Design**
    - Mobile-first approach
    - Breakpoints: 1024px, 768px
    - Mobile menu
    - Stacked layouts on mobile
    - Touch-friendly interactions

---

## Architecture

### Frontend Structure
```
/app/frontend/src/
├── components/
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── Industries.jsx
│   ├── LoadingAnimation.jsx
│   ├── Navbar.jsx
│   ├── Products.jsx
│   ├── ProductGalleryModal.jsx
│   └── WhatsAppButton.jsx
├── pages/
│   └── Home.jsx
├── mockData.js
├── App.js
├── App.css
└── index.css
```

### Mock Data Structure
```javascript
heroData: { headline, subheadline, ctaText, image }
aboutData: { headline, body, image }
products: [{ id, name, description, image, icon }]
industries: [{ id, title, description, icon }]
packagingTypes: [string array - 9 types]
navLinks: [{ name, href }]
footerData: { tagline, email, phone, copyright }
```

---

## Next Tasks (Prioritized Backlog)

### P0 - Critical (Backend Development)
1. **Email Integration Setup**
   - Install Resend SDK
   - Configure environment variables (RESEND_API_KEY, SENDER_EMAIL)
   - Create backend API endpoint: POST /api/contact/send-quote
   - Connect frontend contact form to backend API
   - Test email delivery with real submissions
   - Update contact form to show success/error states

2. **Backend API Development**
   - Set up FastAPI endpoints for contact form
   - Create MongoDB schema for storing enquiries
   - Add form data validation
   - Implement error handling and logging

### P1 - High Priority
3. **Form Enhancement**
   - Add reCAPTCHA or honeypot spam protection
   - Implement rate limiting
   - Add file upload for project briefs (optional)
   - Email confirmation to user

4. **WhatsApp Integration Enhancement**
   - Replace placeholder phone number with real business number
   - Customize pre-filled message based on page context
   - Add tracking for WhatsApp clicks

5. **Analytics & Tracking**
   - Add Google Analytics or similar
   - Track form submissions
   - Track WhatsApp button clicks
   - Track product modal views

### P2 - Nice to Have
6. **SEO Optimization**
   - Add meta tags for all pages
   - Implement Open Graph tags
   - Add structured data (Schema.org)
   - Create sitemap.xml
   - Optimize images with lazy loading

7. **Performance**
   - Optimize image sizes and formats
   - Implement image lazy loading
   - Add service worker for caching
   - Minify CSS/JS for production

8. **Additional Features**
   - Case studies section
   - Client testimonials
   - Product catalog with pricing (if applicable)
   - Blog section for content marketing
   - Multi-language support

---

## API Contracts (To Be Implemented)

### POST /api/contact/send-quote
**Request:**
```json
{
  "name": "John Doe",
  "company": "Brand Name",
  "email": "john@brand.com",
  "packagingType": "Woven Care Labels",
  "message": "Project details..."
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Thank you! We will respond within 24 hours.",
  "enquiry_id": "uuid"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Failed to send enquiry. Please try again.",
  "error": "error details"
}
```

---

## Technical Stack

**Frontend:**
- React 19
- React Router v7
- Axios for API calls
- Lucide React (icons)
- Sonner (toast notifications)
- Tailwind CSS
- Custom CSS animations

**Backend (To Be Implemented):**
- FastAPI
- MongoDB with Motor (async driver)
- Resend SDK (email service)
- Pydantic for validation

**Infrastructure:**
- Hot reload enabled
- Supervisor for process management
- Environment-based configuration

---

## User Personas

1. **Fashion Designer (Primary)**
   - Looking for custom packaging to match brand aesthetic
   - Values sustainability and premium quality
   - Needs quick quotes and responsive communication

2. **Clothing Brand Manager (Primary)**
   - Managing brand touchpoints across products
   - Budget-conscious but quality-focused
   - Wants reliable supplier with multiple product options

3. **Boutique Retailer (Secondary)**
   - Needs branded packaging for retail experience
   - Smaller volumes, personalized service
   - Values uniqueness and eco-friendly materials

---

## Success Metrics (To Be Tracked)

- Contact form submission rate
- WhatsApp enquiry clicks
- Product modal engagement
- Time on site / scroll depth
- Mobile vs desktop traffic
- Email open rates (backend)
- Conversion rate (enquiry to customer)

---

## Design Assets

**Images from Unsplash:**
- Hero: Sustainable packaging flat lay
- Products: Individual product images for each card
- About: Fashion designer workspace
- All images selected for warm, earthy, editorial aesthetic

**Fonts from Google Fonts:**
- Playfair Display (400, 600, 700)
- DM Sans (400, 500, 600)

---

## Notes

- Frontend is fully functional with mock data
- All animations and interactions working smoothly
- Design follows brand guidelines precisely
- No gradients used (following design restrictions)
- Generous whitespace throughout
- Responsive on all devices
- Ready for backend integration

