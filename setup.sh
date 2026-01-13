#!/bin/bash

echo "🚀 GBI Platform Setup Script"
echo "============================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found. Please create it with your environment variables."
    echo "📝 Copy env.example to .env.local and fill in your values:"
    echo ""
    echo "   cp env.example .env.local"
    echo ""
    echo "🔑 Required environment variables:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" 
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - STRIPE_PUBLISHABLE_KEY"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - STRIPE_WEBHOOK_SECRET"
    echo "   - RESEND_API_KEY"
    echo ""
    exit 1
fi

echo "✅ .env.local file found"

# Check if Supabase variables are set
source .env.local

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ "$NEXT_PUBLIC_SUPABASE_URL" = "your_supabase_url_here" ]; then
    echo "❌ Supabase URL not configured. Please update your .env.local file."
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" = "your_supabase_anon_key_here" ]; then
    echo "❌ Supabase Anon Key not configured. Please update your .env.local file."
    exit 1
fi

echo "✅ Environment variables configured"

# Test database connection
echo "🔍 Testing database connection..."

node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

supabase.from('users').select('count').then(({ data, error }) => {
  if (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('💡 Make sure you have run the SQL schema in your Supabase project:');
    console.log('   1. Go to your Supabase project');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Run the contents of supabase-schema.sql');
    process.exit(1);
  } else {
    console.log('✅ Database connection successful');
    process.exit(0);
  }
}).catch(err => {
  console.log('❌ Database connection error:', err.message);
  process.exit(1);
});
"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup complete! Your GBI platform is ready to use."
    echo ""
    echo "📋 Next steps:"
    echo "   1. Make sure you have a Stripe product with price ID: price_1OHNdr2eZvKYlo2C7X0Q8X4Y"
    echo "   2. Configure your Stripe webhook endpoint: /api/webhooks/stripe"
    echo "   3. Start the development server: npm run dev"
    echo "   4. Visit: http://localhost:3000"
    echo ""
else
    echo ""
    echo "❌ Setup failed. Please check the error messages above."
    exit 1
fi
