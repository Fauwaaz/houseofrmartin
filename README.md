# Headless Ecommerce Template
## _Built with Nextjs and Wordpress_

<p dir="auto"><a href="https://nextjs-wordpress-ecommerce-template.vercel.app/" rel="nofollow"><img src="https://img.shields.io/badge/-Live%20Demo-brightgreen" alt="Go to - Live Site" data-canonical-src="https://img.shields.io/badge/-Live%20Demo-brightgreen" style="max-width: 100%; height: 25px;"></a></p>

An ecommerce template I built with Nextjs and Wordpress as a headless CMS solution. Everything is dynamically generated through the admin panel. The frontend is linked with Graphql and ACF. I used localstorage to keep data of the global state and the cart / payment process on the users browser. 

### Dependancies

#### Client
- Next
- React
- Apollo
- Framer Motion
- Canvas Confetti
- React Icons
- Graphql
- Stripe

#### Wordpress
- Next
- React
- Apollo
- Framer Motion
- Canvas Confetti
- Graphql
- WPGraphQL
- Stripe

### Config

```json
{
  "name": "nextjs-wordpress-ecommerce-template",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@apollo/client": "^3.7.0",
    "@next/env": "^12.3.1",
    "@stripe/stripe-js": "^1.42.0",
    "canvas-confetti": "^1.5.1",
    "framer-motion": "^7.6.1",
    "graphql": "^16.6.0",
    "next": "12.3.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-icons": "^4.6.0",
    "stripe": "^10.14.0"
  },
  "devDependencies": {
    "eslint": "8.25.0",
    "eslint-config-next": "12.3.1"
  }
}
```

