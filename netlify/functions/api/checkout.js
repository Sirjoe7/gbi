const Stripe = require('stripe')

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { email, priceId } = JSON.parse(event.body)

    if (!email || !priceId) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'Email and price ID are required' }) 
      }
    }

    // Check Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ error: 'Stripe not configured' }) 
      }
    }

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

    let session
    
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.URL || 'https://your-site.netlify.app'}/registration/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.URL || 'https://your-site.netlify.app'}/registration/cancel`,
        customer_email: email,
        metadata: {
          registration_fee: 'true',
        },
      })
    } catch (priceError) {
      // If price doesn't exist, create a new price dynamically
      if (priceError.message?.includes('No such price')) {
        console.log('Creating dynamic price for $15 registration fee...')
        
        // Create a product first
        const product = await stripe.products.create({
          name: 'GBI Registration Fee',
          description: 'Global Bridge Initiative 2026 Amsterdam Summit Registration',
        })
        
        // Create a price for the product
        const newPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: 1500, // $15.00 in cents
          currency: 'usd',
        })
        
        // Create checkout session with the new price
        session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price: newPrice.id,
              quantity: 1,
            },
          ],
          success_url: `${process.env.URL || 'https://your-site.netlify.app'}/registration/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.URL || 'https://your-site.netlify.app'}/registration/cancel`,
          customer_email: email,
          metadata: {
            registration_fee: 'true',
          },
        })
      } else {
        throw priceError
      }
    }

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ url: session.url }) 
    }

  } catch (error) {
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message || 'Failed to create checkout session' }) 
    }
  }
}
