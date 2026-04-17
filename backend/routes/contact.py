from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import os
import asyncio
import logging
import resend
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/contact", tags=["contact"])
logger = logging.getLogger(__name__)

# Initialize Resend
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
BUSINESS_EMAIL = os.environ.get('BUSINESS_EMAIL', 'aurecopackaging@gmail.com')

class ContactFormRequest(BaseModel):
    name: str
    company: str
    email: EmailStr
    packagingType: str
    message: str

@router.post("/send-quote")
async def send_quote_email(request: ContactFormRequest):
    """Send contact form submission via email"""
    
    # Create email HTML content
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Arial', sans-serif; color: #1C1C1A; background-color: #F5F0E8; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }}
            .header {{ border-bottom: 2px solid #6B8E3E; padding-bottom: 15px; margin-bottom: 25px; }}
            .header h1 {{ color: #6B8E3E; margin: 0; font-size: 28px; }}
            .header p {{ color: #6B8E3E; margin: 5px 0 0 0; font-size: 14px; }}
            .content {{ margin: 20px 0; }}
            .field {{ margin-bottom: 20px; }}
            .field-label {{ font-weight: bold; color: #6B8E3E; font-size: 14px; margin-bottom: 5px; }}
            .field-value {{ color: #1C1C1A; font-size: 16px; line-height: 1.6; }}
            .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #E0E0E0; font-size: 12px; color: #666; }}
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
                    <div class="field-value">{request.name}</div>
                </div>
                <div class="field">
                    <div class="field-label">Brand / Company:</div>
                    <div class="field-value">{request.company}</div>
                </div>
                <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value">{request.email}</div>
                </div>
                <div class="field">
                    <div class="field-label">Type of Packaging Needed:</div>
                    <div class="field-value">{request.packagingType}</div>
                </div>
                <div class="field">
                    <div class="field-label">Message:</div>
                    <div class="field-value">{request.message}</div>
                </div>
            </div>
            <div class="footer">
                <p>This email was sent from the Aureco website contact form.</p>
                <p>Packaging with Purpose.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        # Send email using Resend SDK (sync call in thread to keep FastAPI non-blocking)
        email_params = {
            "from": SENDER_EMAIL,
            "to": [BUSINESS_EMAIL],
            "subject": f"New Quote Request from {request.name} - {request.company}",
            "html": html_content,
            "reply_to": request.email
        }
        
        email_response = await asyncio.to_thread(resend.Emails.send, email_params)
        
        logger.info(f"Email sent successfully to {BUSINESS_EMAIL}. Email ID: {email_response.get('id')}")
        
        return {
            "status": "success",
            "message": "Thank you! We will respond within 24 hours.",
            "email_id": email_response.get('id')
        }
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to send enquiry. Please try again or contact us directly at {BUSINESS_EMAIL}"
        )
