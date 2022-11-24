// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";
import { createClient, OAuthStrategy } from "@wix/sdk";

// this is a hack for now, using the site url as the client id
// once there is a proper way to get the client id, we should use that
const clientId = "netanelg4.wixsite.com/my-fitness-site-2";

const wixClient = createClient(
  OAuthStrategy({
    clientId,
    clientSecret: "secret",
    redirectUrls: ["", ""],
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  const oAuthState = JSON.parse(req.cookies["oauthState"]!);
  const tokens = await wixClient.auth.getRedirectTokens(req.url, oAuthState);
  res.setHeader("Set-Cookie", `wixMemberSession=${tokens}; Path=/; HttpOnly`);
  res.setHeader("Location", oAuthState.originalUrl);
  res.statusCode = 302;
  res.end();
}
