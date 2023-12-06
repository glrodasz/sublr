import { handleAuth } from "@auth0/nextjs-auth0";

export default handleAuth({
  baseUrl: process.env.AUTH0_BASE_URL || process.env.VERCEL_URL,
});
