import { cookies } from "next/headers";
import { useRouter } from "next/router";

// this is a hack for now, using the site url as the client id
// once there is a proper way to get the client id, we should use that
const clientId = "netanelg4.wixsite.com/my-fitness-site-2";

const wixClient = createClient(
  wixSessionAuth({
    clientId,
    redirectUrls: ["", ""],
  })
);

export default async function CallbackPage() {
  const { query, push } = useRouter();
  const oAuthState = cookies().get("oauthState")! as any;
  const tokens = await wixClient.auth.getRedirectTokens(query, oAuthState);
  cookies().set("wixMemberSession", tokens);
  wixClient.auth.setTokens(tokens);

  await push(oAuthState.originalUrl);
}
