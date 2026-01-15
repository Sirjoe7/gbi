# Email Setup Guide

## Resend Configuration

### 1. Get Your Resend API Key

1. Sign up at [https://resend.com](https://resend.com)
2. Go to your dashboard → API Keys
3. Create a new API key
4. Copy the key (it starts with `re_`)

### 2. Update Environment Variable

Replace the placeholder in your `.env.local` file:

```env
RESEND_API_KEY=re_your_actual_resend_api_key_here
```

### 3. Verify Your Domain

For production, you'll need to:
1. Add your sending domain in Resend dashboard
2. Verify DNS records (TXT, CNAME)
3. Update the `from` address in `/src/lib/email.ts`

### 4. Test the Email System

The welcome email is automatically sent when:
- User completes registration form
- Payment is successfully processed
- User lands on the success page

## Email Features

### Welcome Email Includes:
- Personalized greeting with user's name
- Registration confirmation
- Payment status
- Next steps instructions
- Important dates and deadlines
- Contact information

### Email Design:
- Responsive HTML template
- Professional branding
- Clear call-to-action buttons
- Mobile-friendly layout

## Troubleshooting

### Email Not Sending:
1. Check Resend API key is correct
2. Verify domain is configured (for production)
3. Check server logs for email errors

### Test Mode:
During development, emails are sent to your Resend test domain. Check the Resend dashboard for delivery status.

### Rate Limits:
- Free tier: 100 emails/day
- Check Resend pricing for higher limits
