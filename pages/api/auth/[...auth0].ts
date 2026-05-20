import type { NextApiRequest, NextApiResponse } from "next";
import auth0 from "../../../lib/auth0";

// Wrap the Auth0 callback so failures redirect to a readable error page.
// Default SDK behaviour ends with an empty/short error body and no
// Content-Type, which iOS Safari (with `X-Content-Type-Options: nosniff` set
// in next.config.js) presents as a 0 KB file download instead of an error.
export async function handleCallbackWithFallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleCallback(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = (error as { status?: number })?.status ?? 500;
    console.error("[auth0 callback] failed:", status, message);
    const reason = encodeURIComponent(message.slice(0, 200) || `auth_${status}`);
    res.writeHead(302, { Location: `/login-error?reason=${reason}` });
    res.end();
  }
}

export default auth0.handleAuth({ callback: handleCallbackWithFallback });
