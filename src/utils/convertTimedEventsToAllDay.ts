import { DateTime } from 'luxon';

import type { RawCalendarEvent } from './calendarEvents';

const dateInZone = (value: string, zone: string): string =>
  DateTime.fromISO(value, { setZone: true }).setZone(zone).toISODate()!;

const nextDate = (date: string, zone: string): string =>
  DateTime.fromISO(date, { zone }).plus({ days: 1 }).toISODate()!;

const convertTimedEventsToAllDay = (
  events: RawCalendarEvent[],
  zone: string
): RawCalendarEvent[] =>
  events.map(event => {
    if ('date' in event.start || !('dateTime' in event.end)) {
      return event;
    }

    const start = dateInZone(event.start.dateTime, zone);
    const end = dateInZone(event.end.dateTime, zone);

    return {
      ...event,
      start: { date: start },
      end: { date: end === start ? nextDate(start, zone) : end }
    };
  });

export {
  convertTimedEventsToAllDay
};
