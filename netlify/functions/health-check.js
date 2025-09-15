// Simple health check endpoint to verify API availability

exports.handler = async (event) => {
  // Only allow HEAD and GET requests
  if (event.httpMethod !== 'HEAD' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check if Supabase environment variables are configured
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceKey) {
      return {
        statusCode: 503,
        body: JSON.stringify({ 
          status: 'error',
          message: 'Database configuration missing' 
        })
      };
    }

    // Return success response
    return {
      statusCode: 200,
      body: event.httpMethod === 'HEAD' ? '' : JSON.stringify({ 
        status: 'ok',
        message: 'API is available',
        timestamp: new Date().toISOString()
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        status: 'error',
        message: err.message 
      })
    };
  }
};