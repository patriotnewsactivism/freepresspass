# Free Press Pass Generator

A digital press pass generator for journalists with Netlify deployment and Stripe integration for physical passes.

## Features

- Digital press pass generation
- Mobile-friendly design with "Open Image" functionality for iOS
- Stripe integration for purchasing laminated passes
- Netlify Forms for tracking issued passes
- YouTube integration for exposure reports

## Setup Instructions

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables in Netlify:
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_PRICE_ID` - Price ID for the laminated pass
4. Deploy to Netlify using `netlify deploy`

## Deployment Script

For one-command deployment, use the provided script:

```bash
chmod +x scripts/go.sh
NETLIFY_AUTH_TOKEN=... \
STRIPE_SECRET_KEY=sk_live_... \
STRIPE_PRICE_ID=price_123 \
GIT_REMOTE=git@github.com:you/freepresspass.git \
SITE_NAME=freepresspass-com \
./scripts/go.sh
```

## Customization

To customize the press pass preview image:
1. Replace `/assets/press-pass-preview.jpg` with your own image
2. Ensure the new image maintains the same dimensions

## License

This project is licensed under the MIT License.