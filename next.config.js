/** @type {import('next').NextConfig} */
// @auth0/nextjs-auth0 validates issuerBaseURL with Joi .uri() — scheme is required.
// Accept host-only values like `dev-xxx.auth0.com` from .env.local.
const issuer = process.env.AUTH0_ISSUER_BASE_URL?.trim();
if (issuer) {
  process.env.AUTH0_ISSUER_BASE_URL = /^https?:\/\//i.test(issuer)
    ? issuer
    : `https://${issuer}`;
}

// Derive AUTH0_BASE_URL from VERCEL_URL when not explicitly set (preview deployments).
if (!process.env.AUTH0_BASE_URL && process.env.VERCEL_URL) {
  process.env.AUTH0_BASE_URL = `https://${process.env.VERCEL_URL}`;
}

const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
