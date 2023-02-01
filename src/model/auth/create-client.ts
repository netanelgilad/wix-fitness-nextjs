import { createClient, OAuthStrategy } from '@wix/api-client';
import { availabilityCalendar } from '@wix/bookings';

export const wixClient = process.env.NEXT_PUBLIC_WIX_CLIENT_ID
  ? createClient({
      modules: { availabilityCalendar },
      auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
    })
  : null;

export type WixClientType = typeof wixClient;
