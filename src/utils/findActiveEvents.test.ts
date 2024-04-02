import { findActiveEvents } from './findActiveEvents';

import type { CalendarEvent } from './calendarEvents';

describe(`findActiveEvents`, () => {
  test(`filter events which starts not in range but recived by api`, () => {
    const data = [
      {
        date: {
          start: new Date('2024-03-29T23:00:00.000Z'),
          end: new Date('2024-03-30T23:00:00.000Z')
        },
        isWholeDayEvent: true,
        content: {
          summary: 'refuse bin',
          description: null,
          location: null,
          uid: null,
          recurrence_id: null,
          rrule: null,
          entity: 'calendar.portsmouth_city_council'
        }
      },
      {
        date: {
          start: new Date('2024-03-29T23:00:00.000Z'),
          end: new Date('2024-03-30T23:00:00.000Z')
        },
        isWholeDayEvent: true,
        content: {
          summary: 'food waste bin',
          description: '',
          location: null,
          uid: 'removed when posted',
          recurrence_id: '20240401',
          rrule: 'FREQ=WEEKLY;BYDAY=MO',
          entity: 'calendar.home_assistant_calendar'
        }
      }
    ];

    const result = findActiveEvents(data as CalendarEvent[], {
      config: {
        filter_events: false,
        pattern: []
      },
      dropAfter: false,
      now: new Date('2024-03-29T12:09:08.879Z'),
      filterFutureEventsDay: '2024-03-29'
    });

    expect(result).toEqual([]);
  });
});
