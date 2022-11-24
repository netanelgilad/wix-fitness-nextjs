import Image from "@app/components/Image/Image";
import {getServiceBySlug} from "@model/service/service-api";
import { cookies } from "next/headers";

// export async function generateStaticParams() {
//   const wixSession = await createWixVisitorSession();
//   const {services} = await getServices(wixSession);
//
//   return services.map(({slug}) => ({ slug, services }));
// }

export default async function ServicePage({params}: any) {
  const wixMemberSession = cookies().get('wixMemberSession');
  const wixVisitorSession = cookies().get('wixVisitorSession');
  wixClient.auth.setTokens(wixMemberSession, wixVisitorSession);

  try {
    await wixClient.cart.createCart();
  } catch (e) {
    if (wixClient.auth.isUnauthorizedError(e)) {
      const state = wixClient.auth.generateOauthRedirectState(window.location)
      cookies().set('oauthState', state);
      wixClient.auth.loginWithRedirect(state);
    } else {
      throw e;
    }
  }

  const service = await getServiceBySlug(params.slug);

  return (
    <>
      {service ?
        <div key={service.id} className="full-w rounded overflow-hidden shadow-lg">
          <Image media={service.info.media}/>
          <div className="px-6 py-4">
            <a
              href={`/service/${service.slug}`}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Go To Calendar
            </a>
            <div className="font-bold text-xl mb-2">{service.info.name}</div>
            <p className="text-gray-700 text-sm">{service.info.description}</p>
            <p
              className="text-gray-700 text-base">{service.payment.paymentDetails.price + service.payment.paymentDetails.currency}</p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <a
              href={`/service/${service.slug}`}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Go To Calendar
            </a>
          </div>
        </div> :
        <div className="text-3xl w-full text-center p-9 box-border">The service was not found</div>
      }
    </>
  );
}
