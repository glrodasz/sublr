import { initAuth0 } from "@auth0/nextjs-auth0";

const issuer = process.env.AUTH0_ISSUER_BASE_URL?.trim();
const issuerBaseURL =
  issuer && !/^https?:\/\//i.test(issuer) ? `https://${issuer}` : issuer;

export default initAuth0({
  baseURL:
    process.env.AUTH0_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
  ...(issuerBaseURL && { issuerBaseURL }),
});
