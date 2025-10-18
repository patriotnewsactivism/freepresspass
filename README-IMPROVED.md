# Free Press Pass Generator

A web application that generates digital press passes for journalists, with optional paid laminated versions. This application uses Supabase for database storage and Stripe for payment processing.

## 🚀 Features

- Generate free digital press passes
- Real-time preview as you type
- Photo upload capability
- Database integration for tracking issued passes
- Stripe integration for paid laminated passes
- Responsive design for mobile and desktop
- Offline capability with localStorage fallback
- Admin interface for managing passes

## 📋 Prerequisites

- Node.js 14+ and npm
- Supabase account (free tier works)
- Stripe account for payment processing
- Netlify account for deployment

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/patriotnewsactivism/freepresspass.git
   cd freepresspass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables in the `.env` file:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   URL=http://localhost:8888
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

1. Create a new Supabase project
2. Run the migration script in `supabase/migrations/20250908172116_init_press_passes.sql`
3. Make sure Row Level Security (RLS) is enabled
4. Copy your Supabase URL and keys to your `.env` file

## 💳 Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Create a webhook endpoint in Stripe pointing to `https://your-domain.com/.netlify/functions/stripe-webhook`
4. Set the webhook to listen for `checkout.session.completed` and `payment_intent.succeeded` events
5. Copy your Stripe webhook secret to your `.env` file

## 📦 Deployment

### Netlify Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.`
4. Add your environment variables in the Netlify dashboard
5. Deploy your site

### Environment Variables in Netlify

Make sure to add all the environment variables from your `.env` file to your Netlify site's environment variables:

- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- URL (set to your Netlify domain)

## 🧪 Testing

### Testing the Free Press Pass Generation

1. Fill out the form with your name, title, and email
2. Upload a photo (optional)
3. Click "Generate FREE Press Pass Now"
4. Verify that the pass is generated correctly
5. Download or open the pass image

### Testing the Paid Laminated Pass

1. Fill out the form
2. Click "Enhanced/Laminated Version $15"
3. Complete the Stripe checkout process
4. Verify that you are redirected to the success page
5. Check that your order details are displayed correctly

### Testing Database Integration

1. Generate a press pass
2. Check your Supabase database to verify the record was created
3. Check the admin interface to see if the pass appears

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check your Supabase URL and keys
   - Verify that your Supabase project is active
   - Check browser console for error messages

2. **Stripe Payment Issues**
   - Ensure your Stripe keys are correct
   - Check that your webhook is configured properly
   - Use Stripe's test mode for development

3. **Netlify Function Errors**
   - Check Netlify function logs
   - Verify environment variables are set correctly
   - Check for syntax errors in function code

## 📱 Mobile Responsiveness

The application is designed to be fully responsive on mobile devices. Key mobile features include:

- Responsive form layout
- Mobile-friendly press pass preview
- Touch-friendly buttons
- Optimized image handling for mobile uploads

## 🔒 Security Considerations

- All database operations use Row Level Security (RLS)
- Stripe payments are processed securely
- Input validation is performed on both client and server
- CORS headers are properly configured
- Content Security Policy is implemented

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Constitutional Press Association for the original concept
- Leroy Truth Investigations and The Exposure Report for sponsorship
- First Amendment of the U.S. Constitution for protecting freedom of the press