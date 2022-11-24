import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
    // this is a hack for now, using the site url as the client id
  // once there is a proper way to get the client id, we should use that
const clientId = "netanelg4.wixsite.com/my-fitness-site-2";

const wixClient = createClient(
  wixSessionAuth({
    clientId,
    tokens: wixSession,
    redirectUrls: ['', '']
  })
);

wixClient.auth.handleRedirectCallback();

  return <Component {...pageProps} />;
}
