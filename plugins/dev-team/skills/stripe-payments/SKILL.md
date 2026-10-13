---
name: stripe-payments
description: Integrates Stripe Checkout in Next.js - create the payment session on the server with prices from the database, redirect, receive the webhook with signature verification and test in test mode. Use it to charge for products, services or bookings.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Payments with Stripe Checkout

Stripe hosts the payment page: you never see or store the card. Test mode only while you build.

## Procedure

1. **Variables** in `.env.local` (never in the repository; add `.env*` to `.gitignore`, it already comes by default):
   `STRIPE_SECRET_KEY=sk_test_...`, `STRIPE_WEBHOOK_SECRET=whsec_...`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
   The person puts the keys in from their Stripe dashboard (test mode); if they are missing, ask for them and continue with
   the rest, do not invent them.
2. **Client** `src/lib/stripe.ts`:
   ```ts
   import Stripe from 'stripe'
   export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
   ```
3. **Create session** `src/app/api/checkout/route.ts`:
   ```ts
   import { z } from 'zod'
   import { stripe } from '@/lib/stripe'
   const Body = z.object({ items: z.array(z.object({ slug: z.string(), quantity: z.number().int().min(1).max(20) })).min(1) })

   export async function POST(req: Request) {
     const parsed = Body.safeParse(await req.json())
     if (!parsed.success) return Response.json({ error: 'Carrito inválido' }, { status: 400 })
     // 1) read products and prices from the DATABASE by slug (ignore any price from the client)
     // 2) if any is missing or inactive: 400
     const line_items = products.map((p, i) => ({
       quantity: parsed.data.items[i].quantity,
       price_data: { currency: 'mxn', unit_amount: p.price_cents, product_data: { name: p.name } },
     }))
     const session = await stripe.checkout.sessions.create({
       mode: 'payment', line_items,
       success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gracias?s={CHECKOUT_SESSION_ID}`,
       cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancelado`,
       metadata: { order_id: String(orderId) },
     })
     return Response.json({ url: session.url })
   }
   ```
   (`products` and `orderId` come from your query; save the order in `pending` status before redirecting.)
   The browser receives `url` and does `window.location.href = url`.
4. **Webhook** `src/app/api/stripe/webhook/route.ts`: read the **raw body** and verify the signature:
   ```ts
   export async function POST(req: Request) {
     const body = await req.text()
     const signature = req.headers.get('stripe-signature')!
     let event
     try { event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!) }
     catch { return new Response('Firma inválida', { status: 400 }) }
     if (event.type === 'checkout.session.completed') {
       // mark the order (metadata.order_id) as paid; it is idempotent: if it was already paid, do nothing
     }
     return new Response('ok')
   }
   ```
5. **Test locally**: `stripe listen --forward-to localhost:3000/api/stripe/webhook` (requires the Stripe CLI;
   tell the person how to install it, do not install it without telling them) and pay with `4242 4242 4242 4242`,
   any future date and CVC. Also test: cancel, tampered cart, forged signature (must return 400).
6. **Before charging for real** (the person does this): activate the Stripe account, put the `live` keys
   in the hosting, create the production webhook with the public URL.

## Output format

Routes created, necessary variables (names), result of each test (passed/failed with what was observed).

## Never

- Calculate the total in the browser or trust a `unit_amount` sent by the client.
- Mark `paid` from the `/gracias` page: only the verified webhook.
- Write real keys in project files, commits or messages.
- Process the webhook with `req.json()`: it breaks signature verification.

## Why

Anyone can visit the success redirect; only the signed webhook proves that Stripe charged.
