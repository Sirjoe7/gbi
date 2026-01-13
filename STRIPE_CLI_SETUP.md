# Stripe CLI Setup Guide

## Quick Setup with Stripe CLI

Since you have Stripe CLI installed, here's how to test payments locally:

### 1. Login to Stripe
```bash
stripe login
```
This will open your browser to authenticate with Stripe.

### 2. Forward Webhooks to Your Local Server
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will output a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_... 
```

### 3. (Optional) Add the Webhook Secret to .env.local
If you want to verify webhooks, add the secret from step 2:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Test the Registration Flow
- Start your development server (already running)
- Go to http://localhost:3000/registration
- Complete the registration form
- Proceed to payment - it will now work with your real Stripe test keys!

## What This Does

- **Real Payments**: Uses your actual Stripe test keys for real payment processing
- **Local Webhooks**: Stripe CLI forwards webhook events to your local server
- **Automatic Updates**: Payment status updates automatically when payment succeeds
- **Development Mode**: Webhook signature verification is optional for testing

## Test Cards

Use these Stripe test cards for testing:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

Any future expiration date, any CVC, and any postal code work for testing.

## Notes

- Keep the Stripe CLI running in a separate terminal window
- Your .env.local already has the correct Stripe test keys configured
- No need to set up webhooks in the Stripe dashboard when using CLI
