This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## What this app does

Waletto tracks subscription expenses, savings and investments, and gives a
money-flow view of your finances (net = income − expenses − savings −
investments). It supports multiple currencies first-class: every amount
stores its native currency, and reporting converts through live exchange
rates into a per-user display currency.

- **Dashboard** (`/`) — net-flow hero, per-domain stat cards, cash-flow
  chart, expense breakdown, recent payments, next to expire.
- **Incomes / Expenses / Investments / Savings** (`/incomes`, `/expenses`,
  `/investments`, `/savings`) — one parameterized page (`DomainPage`) per
  domain: KPI header, period control, area chart, category tabs, item table
  with create/edit/delete. Expenses' Subscriptions tab surfaces subscription
  cost insights (monthly/annualized, % of income, next charge).
- **Prospect** (`/prospect`) — a what-if simulator: check any recurring
  expense, investment or saving to see the monthly/annual amount it would
  free and how your net would change, projected 6 or 12 months out.
- **Methods** (`/methods`) — payment methods CRUD (cards, wallets, bank
  transfers, cash, crypto).
- **Settings** (`/settings`) — account info, main reporting currency, redo
  onboarding.

Day-to-day manual transaction entry has an API (`POST /api/transactions`)
but no UI yet — recurring items are the only write path exposed today.
Six months of synthetic PAID transaction history is backfilled from active
recurring items on first dashboard visit (`useMaterialize`), idempotently.

## Getting Started

First, run the development server:

```bash
nvm use   # uses .nvmrc (Node 24)
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Local Environment Setup

This project uses Firebase Firestore as database and Auth0 as Auth provider so you have to complete some steps before running the project locally, those are listed below:

1. Create a `.env.local` file into the root and copy the content of `.env.local.example` inside
2. Create a firebase project at the [Firebase Website](https://firebase.google.com), go to project config, click "Add application" and add a web app.
3. Take the credentials provided by firebase to your web app and copy them into `.env.local`
4. In your firebase project config go to "Service accounts" and click "Generate new private key". It will download a json file, change it's name to `serviceAccountKey.dev.json` and paste it in the project's root `/firebase` folder
5. Go to [Auth0 website](https://auth0.com) and create and account if you don't have one or log in
6. Create a web classic project and select Next JS as technology
7. Copy your Auth0 application config from "Settings" and paste it in their respective variables inside the `.env.local` file
8. Follow the Auth0 example to configure the callback URL's

Now the project is ready to run. Run the project to check everything is working fine and the subscriptions list will now show empty because you won't have any data in your firestore database.

To populate your Firestore database run the two seed scripts:

```bash
# 1. Seed the global services catalogue (Netflix, Spotify, etc.) — run once
pnpm seed:global

# 2. Seed per-user data (categories, payment methods, transactions) — run after first login
pnpm seed:user <userId>
```

To find your `userId`, add a temporary `console.log` in any page to print the Auth0 `user.sub` value after logging in.

## Firebase Rules

The deployed security rules live in [`firestore.rules`](./firestore.rules) —
deploy them with `firebase deploy --only firestore:rules` (or paste the file
into the Firebase console). Composite indexes live in
[`firestore.indexes.json`](./firestore.indexes.json).
