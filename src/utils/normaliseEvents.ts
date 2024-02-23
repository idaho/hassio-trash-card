import type { CalendarEvent, RawCalendarEvent } from './calendarEvents';

const normaliseEvents = (events: RawCalendarEvent[], timezoneOffset: string): CalendarEvent[] => {
  const beginingTime = new Date();

  beginingTime.setUTCHours(0);
  beginingTime.setMinutes(0);
  beginingTime.setSeconds(0);
  beginingTime.setMilliseconds(0);

  const isoDateString = beginingTime.toISOString();
  const timeAtZero = `${isoDateString.slice(isoDateString.indexOf(`T`), -1)}${timezoneOffset}`;

  return events.
    map((item): CalendarEvent => ({
      date: {
        start: new Date('date' in item.start ? `${item.start.date}${timeAtZero}` : item.start.dateTime),
        end: new Date('date' in item.end ? `${item.end.date}${timeAtZero}` : item.end.dateTime)
      },
      isWholeDayEvent: Boolean('date' in item.start),
      content: {
        ...Object.fromEntries(Object.entries(item).filter(([ key ]) =>
          ![ 'end', 'start' ].includes(key))) as CalendarEvent['content']
      }
    }));
};

export {
  normaliseEvents
};
