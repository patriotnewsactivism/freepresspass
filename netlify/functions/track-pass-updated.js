const { createClient } = require('@supabase/supabase-js');

// Initialize a Supabase client with the service role key so that
// inserts can bypass Row Level Security. These environment variables
// must be provided in Netlify settings.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Set the contact email address
const contactEmail = 'press@freepresspass.com';

// Validate environment variables
if (!supabaseUrl || !serviceKey) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, serviceKey);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust in production
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!data.name || !data.email || !data.pass_number) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Adjust in production
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ error: 'Missing required fields: name, email, or pass_number' })
      };
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Adjust in production
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Prepare the payload with consistent field names
    const payload = {
      name: data.name,
      title: data.title || null,
      email: data.email,
      pass_number: data.pass_number,
      download_type: data.download_type || 'download', // Track the type of download
      created_at: new Date().toISOString(),
      contact_email: contactEmail // Add the contact email
    };

    // Insert the record into Supabase
    const { data: inserted, error } = await supabase
      .from('press_passes')
      .insert(payload)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Adjust in production
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          error: 'Database error',
          details: error.message,
          code: error.code
        })
      };
    }

    // Return the inserted record
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust in production
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        message: 'Press pass created successfully',
        data: inserted[0]
      })
    };
  } catch (err) {
    console.error('Server error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust in production
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Server error',
        details: err.message
      })
    };
  }
};