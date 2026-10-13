---
name: bootstrap-ecommerce
description: Builds an online store on Next.js - catalog, product page, cart, Stripe checkout, payment webhook and orders table - starting with the minimum that sells. Use it when the person wants to sell products online; depends on bootstrap-nextjs-site, stripe-payments and api-and-database.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Ecommerce bootstrap

> **Standalone mode:** if the `agentos_*` tools are not available (AgentOS not installed), skip every `agentos_*` call and any "virtual file"/Archivos step: write the document on disk inside the project folder (`<project>/...`) and tell the person its relative path.

The first store is **small and real**: few products, a checkout that works, saved orders.
No marketplace, user accounts or complex inventory is built unless they ask for it.

## Prior decisions (ask them, do not invent them)

| Question | Why it matters |
|---|---|
| How many products, and with variants (size/color)? | Up to ~50 products: catalog in your own database. Hundreds, or syncing with inventory: consider Shopify instead of building |
| Physical or digital shipping? | Physical requires an address and shipping cost; digital requires delivery by email/download |
| Where does it charge? | Stripe Checkout by default. Mercado Pago or another: only the payment layer changes, the rest stays the same |
| Is VAT included in the price? | It is shown and stored the same way across the whole site; no own taxes are calculated without an accountant |

If the volume or the inventory is large, say so: "this is already Shopify" is a valid answer.

## Procedure

1. **Project** with `bootstrap-nextjs-site` (shadcn + tokens). Add: `pnpm add stripe zod zustand`.
2. **Data** (skill `api-and-database`): tables `products` (id, slug, name, description, price_cents,
   currency, image, active), `orders` (id, stripe_session_id, status, total_cents, email, created_at) and
   `order_items`. **Prices always in integer cents**, never decimals.
3. **Pages**:
   - `/tienda`: grid with simple filters (see `modern-ui`: product card).
   - `/tienda/[slug]`: gallery, price, "Agregar" button, details; `Product` JSON-LD (skill `seo-and-metadata`).
   - `/carrito`: editable list with total; state in `zustand` persisted in `localStorage`.
   - `/gracias` and `/cancelado`: what the person sees when returning from Stripe.
4. **Checkout** (skill `stripe-payments`): route `POST /api/checkout` that receives `[{slug, quantity}]`,
   **re-reads the prices from the database** (never trusts the browser's prices) and creates the
   Stripe session.
5. **Webhook** `POST /api/stripe/webhook` marks the order `paid` only after verifying the signature.
6. **Minimal panel** `/admin/orders` protected (`ADMIN_TOKEN` variable or real auth if there are several users): list of orders.
7. **Tests in Stripe test mode** (card `4242 4242 4242 4242`): completed purchase, canceled purchase,
   invalid quantity, inactive product. Write down what you saw.

(The storefront URLs `/tienda`, `/carrito`, `/gracias`, `/cancelado` are customer-facing and stay in Spanish
because the sites are for Mexican clients.)

## Output format

`STORE-README.md` (also written with `agentos_file_write` as `dev/<project>/STORE-README.md` and the project folder delivered with `agentos_task_deliver` `path`, so the person reads it in the web): how it is run (the agent starts it and gives the URL), necessary environment variables (names, never values), how to add a
product, the payment flow tested, what is missing to really sell (activated Stripe account, domain, shipping/return
policies, privacy notice and terms, which the person or their lawyer writes).

## Never

- Charge with the price the browser sends, or mark an order paid without the webhook signature.
- Store card data: that is Stripe's job.
- Use `sk_live` keys or activate real charges: the person puts in the real keys when publishing.
- Invent products, prices, shipping policies or reviews.

## Why

The server-side price and the webhook signature are what separate a store from a page that gives away
merchandise. The rest (design, animation) gets fixed later; this does not.
