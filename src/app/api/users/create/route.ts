import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function OPTIONS(req: NextRequest) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
  return new NextResponse(null, { status: 200, headers })
}

export async function POST(req: NextRequest) {
  // Add CORS headers
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    console.log('🔍 User creation request received')
    
    const body = await req.json()
    console.log('📝 Request body:', body)
    
    const { email, firstName, lastName, country, educationLevel, careerStage, fieldOfStudy, roleType } = body

    // Check environment variables
    console.log('🔑 Checking environment variables...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
      console.error('❌ Supabase URL not configured')
      return NextResponse.json(
        { error: 'Supabase URL not configured. Please check your environment variables.' },
        { status: 500, headers }
      )
    }
    
    if (!supabaseKey || supabaseKey === 'your_supabase_service_role_key_here') {
      console.error('❌ Supabase service role key not configured')
      return NextResponse.json(
        { error: 'Supabase service role key not configured. Please check your environment variables.' },
        { status: 500, headers }
      )
    }

    console.log('✅ Environment variables look good')

    // Validate required fields
    if (!email || !firstName || !lastName || !country || !educationLevel || !careerStage || !fieldOfStudy || !roleType) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400, headers }
      )
    }

    // Test database connection
    console.log('🔍 Testing database connection...')
    try {
      const { data: testData, error: testError } = await getSupabaseAdmin()
        .from('users')
        .select('count')
        .limit(1)
      
      if (testError) {
        console.error('❌ Database connection failed:', testError)
        return NextResponse.json(
          { error: `Database connection failed: ${testError.message}. Please ensure the database schema is installed.` },
          { status: 500, headers }
        )
      }
      console.log('✅ Database connection successful')
    } catch (dbError) {
      console.error('❌ Database test error:', dbError)
      return NextResponse.json(
        { error: `Database test failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}` },
        { status: 500, headers }
      )
    }

    // Check if user already exists
    console.log('🔍 Checking if user already exists...')
    const { data: existingUser, error: checkError } = await getSupabaseAdmin()
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Database check error:', checkError)
      return NextResponse.json(
        { error: `Database error during user check: ${checkError.message}` },
        { status: 500, headers }
      )
    }

    if (existingUser) {
      console.log('❌ User already exists:', existingUser.id)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400, headers }
      )
    }

    // Create new user record
    console.log('🔍 Creating new user record...')
    const { data: user, error } = await getSupabaseAdmin()
      .from('users')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        country,
        education_level: educationLevel,
        career_stage: careerStage,
        field_of_study: fieldOfStudy,
        role_type: roleType,
        payment_status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Database error during user creation:', error)
      return NextResponse.json(
        { error: `Failed to create user record: ${error.message}` },
        { status: 500, headers }
      )
    }

    console.log('✅ User created successfully:', user)
    return NextResponse.json({ user }, { headers })
  } catch (error) {
    console.error('❌ Server error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500, headers }
    )
  }
}
