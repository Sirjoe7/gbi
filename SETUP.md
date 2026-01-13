# GBI Platform Setup Guide

## Quick Setup

1. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
2. **Fill in your environment variables** in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
   - `RESEND_API_KEY` - Your Resend API key (for emails)

3. **Database Setup**
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the contents of `supabase-schema.sql`

4. **Run Setup Script**
   ```bash
   ./setup.sh
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Troubleshooting "Failed to create user record"

If you're getting this error, it's likely due to:

### 1. Environment Variables Not Set
Make sure your `.env.local` file is properly configured with real values, not placeholders.

### 2. Database Schema Not Created
Run the SQL schema in your Supabase project:
```sql
-- Copy the contents of supabase-schema.sql and run in Supabase SQL Editor
```

### 3. Supabase Connection Issues
Verify your Supabase URL and keys are correct.

## Stripe Configuration

1. Create a $15 product in Stripe
2. Note the price ID (update in registration flow if different)
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Configure webhook to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`

## Testing the Platform

1. Visit http://localhost:3000
2. Click "Apply Now"
3. Fill out registration form
4. Complete payment (test mode)
5. Upload documents
6. Check dashboard

## Support

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the database schema is properly installed
4. Make sure Stripe is configured in test mode
