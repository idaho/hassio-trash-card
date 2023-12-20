interface RawCalendarEvent {
  start: {
    date: string;
  } | {
    dateTime: string;
  };
  end: {
    date: string;
  } | {
    dateTime: string;
  };
  summary: string;
  description: string | null;
  location: string | null;
  uid: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  recurrence_id: string | null;
  rrule: string | null;
}

interface CalendarEvent {
  date: {
    start: Date;
    end: Date;
  };
  isWholeDayEvent: boolean;
  content: Omit<RawCalendarEvent, 'start' | 'end'>;
}

export type {
  CalendarEvent,
  RawCalendarEvent
};
