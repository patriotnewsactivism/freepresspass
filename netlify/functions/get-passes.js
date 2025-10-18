const { createClient } = require('@supabase/supabase-js');

// Use the service role key to fetch all press pass records. Row
// Level Security must be enabled on the table to prevent unauthorized
// access through the anon key.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !serviceKey) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, serviceKey);

exports.handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
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
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 100;
    const offset = parseInt(queryParams.offset) || 0;
    const sortBy = queryParams.sortBy || 'issued_at';
    const sortOrder = queryParams.sortOrder === 'asc' ? true : false;
    
    // Build the query
    let query = supabase
      .from('press_passes')
      .select('*')
      .order(sortBy, { ascending: sortOrder })
      .range(offset, offset + limit - 1);
    
    // Add filters if provided
    if (queryParams.email) {
      query = query.eq('email', queryParams.email);
    }
    
    if (queryParams.organization) {
      query = query.eq('organization', queryParams.organization);
    }
    
    // Execute the query
    const { data, error, count } = await query;

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

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('press_passes')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
    }

    // Return the data with pagination info
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust in production
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        data,
        pagination: {
          total: totalCount || 'unknown',
          limit,
          offset,
          hasMore: data.length === limit
        }
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