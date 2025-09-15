const { createClient } = require('@supabase/supabase-js');

// Initialize a Supabase client with the service role key so that
// inserts can bypass Row Level Security.  These environment variables
// must be provided in Netlify settings.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  try {
    const data = JSON.parse(event.body || '{}');
    // Validate basic fields
    if (!data.name || !data.email || !data.pass_number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    const payload = {
      name: data.name,
      title: data.title || null,
      email: data.email,
      pass_number: data.pass_number,
      organization: data.organization || null,
      created_at: new Date().toISOString()
    };
    const { data: inserted, error } = await supabase
      .from('press_passes')
      .insert(payload)
      .select();
    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(inserted[0])
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};