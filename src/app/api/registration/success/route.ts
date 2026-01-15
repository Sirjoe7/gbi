import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'
import { sendWelcomeEmail } from '@/lib/email'

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
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 400, headers }
      )
    }

    // Get user by email
    const { data: user, error } = await supabaseAdmin
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
    await supabaseAdmin
      .from('users')
      .update({ 
        payment_status: 'paid',
        stripe_customer_id: session.customer as string,
        payment_intent_id: session.payment_intent as string
      })
      .eq('id', user.id)

    // Send welcome email
    try {
      const emailResult = await sendWelcomeEmail({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        roleType: user.role_type,
        country: user.country,
        educationLevel: user.education_level,
        fieldOfStudy: user.field_of_study,
        careerStage: user.career_stage
      })
      
      if (!emailResult.success) {
        console.error('Failed to send welcome email:', emailResult.error)
        // Don't fail the request, just log the error
      } else {
        console.log('Welcome email sent successfully to:', user.email)
      }
    } catch (emailError) {
      console.error('Email service error:', emailError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ user }, { headers })
  } catch (error) {
    console.error('Success page error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    )
  }
}
