import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'

export async function OPTIONS(req: NextRequest) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
  return new NextResponse(null, { status: 200, headers })
}

export async function GET(req: NextRequest) {
  // Add CORS headers
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {

    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400, headers }
      )
    }

    // Retrieve the session from Stripe
    const stripeInstance = getStripe()
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 400, headers }
      )
    }

    // Get user by email
    const { data: user, error } = await getSupabaseAdmin()
      .from('users')
      .select('*')
      .eq('email', session.customer_email as string)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers }
      )
    }

    // Update user payment status
    await getSupabaseAdmin()
      .from('users')
      .update({ 
        payment_status: 'paid',
        stripe_customer_id: session.customer as string,
        payment_intent_id: session.payment_intent as string
      })
      .eq('id', user.id)

    // Log successful registration (email functionality removed)
    console.log(`User ${user.email} successfully completed registration payment`)
    console.log(`Registration details: ${user.first_name} ${user.last_name}, ${user.role_type}, ${user.country}`)

    return NextResponse.json({ user }, { headers })
  } catch (error) {
    console.error('Success page error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    )
  }
}
