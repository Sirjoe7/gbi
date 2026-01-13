import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const getStripeProducts = async () => {
  const products = await stripe.products.list({
    active: true,
  })
  return products
}

export const createCheckoutSession = async (priceId: string, customerEmail: string) => {
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
