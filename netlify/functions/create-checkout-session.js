const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.name || !data.passId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Adjust in production
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ error: 'Missing required fields: name or passId' })
      };
    }

    // Create a temporary record in Supabase for this checkout
    try {
      const { error: dbError } = await supabase
        .from('press_passes')
        .insert({
          full_name: data.name,
          email: data.email || null,
          title: data.title || null,
          pass_number: data.passId,
          organization: data.organization || null,
          issued_at: new Date().toISOString(),
          paid: false,
          payment_pending: true
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue with checkout even if database insert fails
      }
    } catch (dbErr) {
      console.error('Error saving to database:', dbErr);
      // Continue with checkout even if database operation fails
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Enhanced Press Pass',
              description: `Laminated Press Pass for ${data.name}`,
              images: ['https://freepresspass.com/assets/press-pass-preview.jpg'],
            },
            unit_amount: 1500, // $15.00
          },
          quantity: data.quantity || 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}&pass_id=${data.passId}`,
      cancel_url: `${process.env.URL}/`,
      metadata: {
        passId: data.passId,
        name: data.name,
        email: data.email || '',
        title: data.title || '',
        organization: data.organization || ''
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust in production
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        url: session.url
      })
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust in production
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: err.message
      })
    };
  }
};