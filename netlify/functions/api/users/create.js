const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  // CORS headers
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
    const { email, firstName, lastName, country, educationLevel, careerStage, fieldOfStudy, roleType } = JSON.parse(event.body)

    // Validate required fields
    if (!email || !firstName || !lastName || !country || !educationLevel || !careerStage || !fieldOfStudy || !roleType) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'All fields are required' }) 
      }
    }

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ error: 'Database not configured' }) 
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ error: `Database error: ${checkError.message}` }) 
      }
    }

    if (existingUser) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'User with this email already exists' }) 
      }
    }

    // Create user
    const { data: user, error } = await supabase
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
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ error: `Failed to create user: ${error.message}` }) 
      }
    }

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ user }) 
    }

  } catch (error) {
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: `Internal server error: ${error.message}` }) 
    }
  }
}
