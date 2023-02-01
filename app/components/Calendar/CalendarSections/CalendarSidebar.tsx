'use client';
import { ServiceInfoViewModel } from '@model/service/service.mapper';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { useServiceFormattedPrice } from '@app/hooks/useServiceFormattedPrice';
import JSURL from 'jsurl';
import { SlotViewModel } from '@app/components/Calendar/CalendarSections/CalendarSlots';
import { availabilityCalendar } from '@wix/bookings';

const CalendarSidebar = ({
  service,
  selectedDate,
  selectedTime,
  slotsForTime,
  timezone,
}: {
  service: ServiceInfoViewModel;
  selectedDate: Date;
  selectedTime: string;
  timezone: string;
  slotsForTime: SlotViewModel[];
  selectedSlot?: SlotViewModel['slotAvailability'];
}) => {
  const [selectedSlot, setSelectedSlot] = useState<
    availabilityCalendar.SlotAvailability | undefined
  >();
  const formattedPrice = useServiceFormattedPrice(
    service!.payment!.paymentDetails
  );
  const goToCheckout = useCallback(() => {
    // TODO: use redirect to wix sdk
    const checkoutUrl = new URL(
      decodeURIComponent(process.env.NEXT_PUBLIC_BOOKINGS_CHECKOUT_URL!)
    );
    const slotData = JSURL.stringify({
      serviceId: service.id,
      slot: { slot: selectedSlot?.slot },
      timezone,
    });
    checkoutUrl.searchParams.set('selectedSlot', slotData);
    checkoutUrl.searchParams.set('origin', window.location.origin);
    checkoutUrl.searchParams.set(
      'headlessExternalUrls',
      JSURL.stringify({
        'paid-plans': window.location.origin + '/plans',
      })
    );

    // TODO: USE PR VERSION TILL BOOKINGS EXPOSE A FORMAL API FOR DEEP LINK
    checkoutUrl.searchParams.set(
      'bookings-form-widget-override',
      // https://github.com/wix-private/bookings-booking-checkout-viewer/pull/570
      '776076fcba105820efa8645dd02846d8441af73f559e59a6f1c8813d'
    );

    window.location.href = checkoutUrl.toString();
  }, [selectedSlot?.slot, service?.id, timezone]);
  useEffect(() => {
    setSelectedSlot(
      slotsForTime?.length === 1
        ? slotsForTime?.[0]?.slotAvailability
        : undefined
    );
  }, [selectedTime, slotsForTime]);

  return (
    <>
      <div className="border-b pb-2">
        <h2 className="text-lg">Booking Summary</h2>
      </div>
      <section className="mt-4">
        <div>{service.info.name}</div>
        <div>
          {format(selectedDate, 'd MMMM yyyy')}
          {selectedTime ? ' at ' + selectedTime : ''}
        </div>
        <section className="text-xs mt-1">
          <div>{service.info.formattedDuration}</div>
          <div>{formattedPrice.userFormattedPrice}</div>
          {slotsForTime.length > 1 ? (
            <>
              <label htmlFor="slot-options" className="mt-3 block">
                Please Select a Slot Option
              </label>
              <select
                value={selectedSlot ? undefined : ''}
                id="slot-options"
                className="block w-full p-2 pr-7 my-3 text-sm text-black border border-black rounded-none bg-white focus:ring-gray-700 focus:border-black"
                onChange={(e) =>
                  setSelectedSlot(
                    slotsForTime[e.target.value as unknown as any]
                      .slotAvailability
                  )
                }
              >
                <option disabled selected value="">
                  Please Select
                </option>
                {slotsForTime.map((slotOption, index) => (
                  <option
                    key={index}
                    disabled={!slotOption.slotAvailability.bookable}
                    value={index}
                  >
                    {`${
                      slotOption.slotAvailability.slot?.location?.name ?? ''
                    } with ${
                      slotOption.slotAvailability.slot?.resource?.name ?? ''
                    }`.trim()}
                  </option>
                ))}
              </select>
            </>
          ) : selectedSlot ? (
            <>
              <div>{selectedSlot.slot?.resource?.name}</div>
              <div>{selectedSlot.slot?.location?.name}</div>
            </>
          ) : null}
        </section>
        <div className="mt-7">
          <button
            disabled={!selectedSlot}
            className="btn-main w-full"
            onClick={goToCheckout}
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
};

export default CalendarSidebar;
