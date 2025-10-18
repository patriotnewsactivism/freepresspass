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
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const signature = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    // Verify the webhook signature
    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
      };
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (err) {
    console.error('Webhook error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook handler failed', details: err.message })
    };
  }
};

// Handle checkout.session.completed event
async function handleCheckoutSessionCompleted(session) {
  try {
    // Get the pass ID from the session metadata
    const passId = session.metadata?.passId;
    if (!passId) {
      console.error('No pass ID found in session metadata');
      return;
    }

    // Update the press pass record in Supabase
    const { data, error } = await supabase
      .from('press_passes')
      .update({
        paid: true,
        payment_pending: false,
        payment_id: session.id,
        payment_amount: session.amount_total,
        payment_date: new Date().toISOString()
      })
      .eq('pass_number', passId)
      .select();

    if (error) {
      console.error('Error updating press pass record:', error);
      return;
    }

    console.log('Press pass payment completed:', data);
  } catch (err) {
    console.error('Error handling checkout session completed:', err);
  }
}

// Handle payment_intent.succeeded event
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    // Get the checkout session to access metadata
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1
    });

    if (sessions.data.length === 0) {
      console.error('No session found for payment intent:', paymentIntent.id);
      return;
    }

    const session = sessions.data[0];
    const passId = session.metadata?.passId;

    if (!passId) {
      console.error('No pass ID found in session metadata');
      return;
    }

    // Update the press pass record in Supabase
    const { data, error } = await supabase
      .from('press_passes')
      .update({
        paid: true,
        payment_pending: false,
        payment_id: paymentIntent.id,
        payment_amount: paymentIntent.amount,
        payment_date: new Date().toISOString()
      })
      .eq('pass_number', passId)
      .select();

    if (error) {
      console.error('Error updating press pass record:', error);
      return;
    }

    console.log('Press pass payment succeeded:', data);
  } catch (err) {
    console.error('Error handling payment intent succeeded:', err);
  }
}