import { createClient, publicClientAuth } from "@wix/sdk";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createWixVisitorSession } from "./auth";

export async function middleware(request: NextRequest) {
  let wixSession = request.cookies.get("wixVisitorSession");

  // this is a hack for now, using the site url as the client id
  // once there is a proper way to get the client id, we should use that
  const clientId = "netanelg4.wixsite.com/my-fitness-site-2";

  const wixClient = createClient({
    modules: {},
    auth: OAuth2({
      clientId,
      tokens: wixSession,
    })
  });

  if (request.nextUrl.pathname.startsWith("/me")) {
    const wixMemberSession = request.cookies.get("wixMemberSession");
    if (!wixMemberSession || !wixClient.auth.isValidToken(wixMemberSession)) {
      const response = NextResponse.redirect(
        wixClient.auth.getAuthorizationUrl({
          redirectUrl: request.url,
        })
      );
      response.cookies.set(
        "oAuthState",
        wixClient.auth.getOauthRedirectState()
      ); // { state, pcke, originalUrl }
      return response;
    } else {
      return NextResponse.next();
    }
  }

  if (wixSession) {
    return NextResponse.next();
  }
  const token = await wixClient.auth.newVisitorSession();

  const response = NextResponse.next();
  response.cookies.set("wixSession", tokens);

  return response;
}
