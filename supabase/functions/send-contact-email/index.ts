// Supabase Edge Function: send-contact-email
// This function sends emails via Resend when a contact form is submitted

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const BUSINESS_EMAIL = 'dhairya2143@gmail.com' // Change to aurecopackaging@gmail.com after domain verification

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, company, email, packagingType, message } = await req.json()

    // Create email HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; color: #1C1C1A; background-color: #F5F0E8; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }
            .header { border-bottom: 2px solid #6B8E3E; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { color: #6B8E3E; margin: 0; font-size: 28px; }
            .header p { color: #6B8E3E; margin: 5px 0 0 0; font-size: 14px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #6B8E3E; font-size: 14px; margin-bottom: 5px; }
            .field-value { color: #1C1C1A; font-size: 16px; line-height: 1.6; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E0E0E0; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Aureco</h1>
                <p>New Quote Request</p>
            </div>
            <div class="content">
                <div class="field">
                    <div class="field-label">Name:</div>
                    <div class="field-value">${name}</div>
                </div>
                <div class="field">
                    <div class="field-label">Brand / Company:</div>
                    <div class="field-value">${company}</div>
                </div>
                <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value">${email}</div>
                </div>
                <div class="field">
                    <div class="field-label">Type of Packaging Needed:</div>
                    <div class="field-value">${packagingType}</div>
                </div>
                <div class="field">
                    <div class="field-label">Message:</div>
                    <div class="field-value">${message}</div>
                </div>
            </div>
            <div class="footer">
                <p>This email was sent from the Aureco website contact form.</p>
                <p>Packaging with Purpose.</p>
            </div>
        </div>
    </body>
    </html>
    `

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [BUSINESS_EMAIL],
        subject: `New Quote Request from ${name} - ${company}`,
        html: htmlContent,
        reply_to: email,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
