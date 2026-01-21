import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  let event

  try {
    // If webhook secret is configured, verify the signature
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      const stripeInstance = getStripe()
      event = stripeInstance.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } else {
      // For development with Stripe CLI, skip signature verification
      console.log('⚠️ Webhook secret not configured - skipping signature verification (development mode)')
      event = JSON.parse(body)
    }
  } catch (error: any) {
    console.error('Webhook processing failed:', error.message)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        
        if (session.metadata?.registration_fee === 'true') {
          // Update user payment status
          const { error } = await supabaseAdmin
            .from('users')
            .update({
              payment_status: 'paid',
              payment_intent_id: session.payment_intent,
              stripe_customer_id: session.customer,
            })
            .eq('email', session.customer_email)

          if (error) {
            console.error('Error updating user payment status:', error)
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
          }

          console.log(`Payment completed for ${session.customer_email}`)
        }
        break
      }
      
      case 'checkout.session.expired': {
        const session = event.data.object as any
        
        if (session.metadata?.registration_fee === 'true') {
          // Update user payment status to failed
          const { error } = await supabaseAdmin
            .from('users')
            .update({
              payment_status: 'failed',
            })
            .eq('email', session.customer_email)

          if (error) {
            console.error('Error updating user payment status:', error)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
