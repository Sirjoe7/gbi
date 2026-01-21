import { NextRequest, NextResponse } from 'next/server'
import { getStripe, createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { email, priceId } = await req.json()

    if (!email || !priceId) {
      return NextResponse.json(
        { error: 'Email and price ID are required' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key_here') {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    let session
    
    try {
      session = await createCheckoutSession(priceId, email)
    } catch (priceError: any) {
      // If price doesn't exist, create a new price dynamically
      if (priceError.message?.includes('No such price')) {
        console.log('Creating dynamic price for $15 registration fee...')
        const stripeInstance = getStripe()
        
        // Create a product first
        const product = await stripeInstance.products.create({
          name: 'GBI Registration Fee',
          description: 'Global Bridge Initiative 2026 Amsterdam Summit Registration',
        })
        
        // Create a price for the product
        const newPrice = await stripeInstance.prices.create({
          product: product.id,
          unit_amount: 1500, // $15.00 in cents
          currency: 'usd',
        })
        
        // Create checkout session with the new price
        session = await createCheckoutSession(newPrice.id, email)
      } else {
        throw priceError
      }
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
