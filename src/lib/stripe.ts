import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2025-12-15.clover',
    })
  }
  return stripeClient
}

export const getStripeProducts = async () => {
  const stripe = getStripe()
  const products = await stripe.products.list({
    active: true,
  })
  return products
}

export const createCheckoutSession = async (priceId: string, customerEmail: string) => {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/registration/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/registration/cancel`,
    customer_email: customerEmail,
    metadata: {
      registration_fee: 'true',
    },
  })

  return session
}
