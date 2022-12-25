'use client';
import { PropsWithChildren } from 'react';
import { SlotAvailability } from '@model/availability/types';
import { Tooltip } from 'flowbite-react';

export type SlotViewModel = {
  formattedTime: string;
  slotAvailability: SlotAvailability;
};

const SlotTooltip = ({
  bookable,
  bookingPolicyViolations,
  children,
}: PropsWithChildren<
  Pick<SlotAvailability, 'bookable' | 'bookingPolicyViolations'>
>) =>
  bookable ? (
    <div className="w-fit">{children}</div>
  ) : (
    <Tooltip
      content={
        bookingPolicyViolations?.tooLateToBook
          ? 'This slot cannot be booked anymore'
          : bookingPolicyViolations?.tooLateToBook
          ? 'It is too early to book this slot'
          : 'This slot cannot be booked'
      }
    >
      {children}
    </Tooltip>
  );

const CalendarSlots = ({
  slots,
  onTimeSelected,
  selectedTime,
}: {
  slots: SlotViewModel[];
  selectedTime: string;
  onTimeSelected: (selectedTime: string) => void;
}) => (
  <>
    {slots.map(
      (
        {
          formattedTime,
          slotAvailability: { bookable, bookingPolicyViolations },
        },
        index
      ) => (
        <button
          key={index}
          className={`px-3 py-1.5 w-full border-2 flex justify-center ${
            bookable
              ? formattedTime === selectedTime
                ? 'border-gray-700 bg-gray-100'
                : 'hover:border-gray-600'
              : 'text-gray-200'
          }`}
          disabled={!bookable}
          aria-label={'Select ' + formattedTime}
          onClick={() => onTimeSelected(formattedTime)}
        >
          <SlotTooltip
            bookable={bookable}
            bookingPolicyViolations={bookingPolicyViolations}
          >
            <span className="text-sm">{formattedTime}</span>
          </SlotTooltip>
        </button>
      )
    )}
  </>
);

export default CalendarSlots;
