/** @type {import('next').NextConfig} */
// @auth0/nextjs-auth0 validates issuerBaseURL with Joi .uri() — scheme is required.
// Accept host-only values like `dev-xxx.auth0.com` from .env.local.
const issuer = process.env.AUTH0_ISSUER_BASE_URL?.trim();
if (issuer) {
  process.env.AUTH0_ISSUER_BASE_URL = /^https?:\/\//i.test(issuer)
    ? issuer
    : `https://${issuer}`;
}

const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
