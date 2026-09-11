import { convertTimedEventsToAllDay } from './convertTimedEventsToAllDay';

import type { RawCalendarEvent } from './calendarEvents';

const timedEvent = (
  start: string,
  end: string
): RawCalendarEvent => ({
  start: { dateTime: start },
  end: { dateTime: end },
  summary: 'Collection',
  description: null,
  location: null,
  uid: 'collection-1',
  recurrence_id: null,
  rrule: null
});

const allDayEvent = (): RawCalendarEvent => ({
  start: { date: '2024-01-15' },
  end: { date: '2024-01-16' },
  summary: 'Collection',
  description: null,
  location: null,
  uid: 'collection-2',
  recurrence_id: null,
  rrule: null
});

describe('convertTimedEventsToAllDay', (): void => {
  test('leaves existing all-day events unchanged', () => {
    const event = allDayEvent();

    const result = convertTimedEventsToAllDay(
      [ event ],
      'Europe/Berlin'
    );

    expect(result).toEqual([ event ]);
    expect(result[0]).toBe(event);
  });

  test('converts a timed event on one local day to one full day', () => {
    const event = timedEvent(
      '2024-01-15T09:00:00+01:00',
      '2024-01-15T10:00:00+01:00'
    );

    const result = convertTimedEventsToAllDay(
      [ event ],
      'Europe/Berlin'
    );

    expect(result[0]).toEqual({
      ...event,
      start: { date: '2024-01-15' },
      end: { date: '2024-01-16' }
    });
  });

  test('uses the configured timezone when determining calendar dates', () => {
    const event = timedEvent(
      '2024-01-15T23:30:00Z',
      '2024-01-16T00:30:00Z'
    );

    const result = convertTimedEventsToAllDay(
      [ event ],
      'Europe/Berlin'
    );

    // Both timestamps are on 2024-01-16 in Europe/Berlin.
    expect(result[0]).toEqual({
      ...event,
      start: { date: '2024-01-16' },
      end: { date: '2024-01-17' }
    });
  });

  test('retains converted dates for an event spanning local dates', () => {
    const event = timedEvent(
      '2024-01-15T23:00:00Z',
      '2024-01-17T00:00:00Z'
    );

    const result = convertTimedEventsToAllDay(
      [ event ],
      'Europe/Berlin'
    );

    expect(result[0]).toEqual({
      ...event,
      start: { date: '2024-01-16' },
      end: { date: '2024-01-17' }
    });
  });

  test('does not mutate the input event', () => {
    const event = timedEvent(
      '2024-01-15T09:00:00+01:00',
      '2024-01-15T10:00:00+01:00'
    );
    const originalEvent = structuredClone(event);

    convertTimedEventsToAllDay([ event ], 'Europe/Berlin');

    expect(event).toEqual(originalEvent);
  });
});
