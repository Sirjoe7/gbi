# Vercel Deployment Checklist

## 🔧 Required Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
RESEND_API_KEY=your_resend_api_key_here
```

### Optional Variables:
```
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

## 🚨 Critical Issues to Fix

### 1. NEXTAUTH_URL Update
Change from localhost to your Vercel domain after deployment.

### 2. Build Issues
- React 19 may have compatibility issues
- Tailwind CSS v4 might cause build problems

## 📋 Deployment Steps

1. **Push latest changes to GitHub** ✅ (Already done)
2. **Add environment variables in Vercel**
3. **Connect Vercel to your GitHub repo**
4. **Trigger deployment**
5. **Update NEXTAUTH_URL after deployment**

## 🔍 Common Build Errors & Solutions

### Error: "React 19 not supported"
**Solution**: Downgrade to React 18:
```bash
npm install react@18 react-dom@18 @types/react@18 @types/react-dom@18
```

### Error: "Tailwind CSS v4 build issues"
**Solution**: Add to next.config.ts:
```typescript
const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};
```

### Error: "Environment variables not found"
**Solution**: Ensure all required variables are set in Vercel dashboard.

## 🧪 Testing Before Deployment

Run locally with production build:
```bash
npm run build
npm run start
```

## 📧 Post-Deployment Setup

1. **Update Stripe webhook URL** to your Vercel domain
2. **Configure Resend domain** for production emails
3. **Test the complete flow** on the deployed URL
