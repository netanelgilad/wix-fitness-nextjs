import './page.css';
import { getServiceBySlug } from '@model/service/service-api';
import Calendar from '@app/components/Calendar/Calendar';
import { useServerAuthSession } from '@app/hooks/useServerAuthSession';
import { Suspense } from 'react';

export default async function ServicePage({ params }: any) {
  const wixSession = useServerAuthSession();
  const service = await getServiceBySlug(params.slug, wixSession);

  return (
    <>
      {service ? (
        <div
          key={service.id}
          className="full-w rounded overflow-hidden shadow-lg max-w-7xl mx-auto"
        >
          <Suspense fallback={'Loading 2'}>
            <Calendar service={service} wixSession={wixSession} />
          </Suspense>
        </div>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border">
          The service was not found
        </div>
      )}
    </>
  );
}