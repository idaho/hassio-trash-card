/* eslint-disable @typescript-eslint/naming-convention */
import calendarEvents from '../../mocks/calendarData.json';
import { findActiveEvent } from './findActiveEvent';
import { getTimeZoneOffset } from './getTimeZoneOffset';
import { normaliseEvents } from './normaliseEvents';
import type { RawCalendarEvent } from './calendarEvents';

describe('findActiveEvent', (): void => {
  const offset = getTimeZoneOffset();

  test('the whole day event today cause its before 10 o`clock', async () => {
    const events = normaliseEvents(calendarEvents as RawCalendarEvent[]);

    const result = findActiveEvent(events, {
      now: new Date(`2023-12-10T09:59:59${offset}`)
    });

    expect(result).toEqual(expect.objectContaining({
      isWholeDayEvent: true,
      content: {
        summary: 'BIO',
        description: null,
        location: null
      }
    }));
  });

  test('the next event because it is after 10 o`clock', async () => {
    const events = normaliseEvents(calendarEvents as RawCalendarEvent[]);

    const result = findActiveEvent(events, {
      now: new Date(`2023-12-10T10:01:59${offset}`)
    });

    expect(result).toEqual(expect.objectContaining({
      isWholeDayEvent: false,
      content: {
        summary: 'Event 1',
        description: null,
        location: null
      }
    }));
  });

  test('the first event, it`s today and has started but not ended', async () => {
    const events = normaliseEvents(calendarEvents as RawCalendarEvent[]);

    const result = findActiveEvent(events, {
      now: new Date(`2023-12-14T13:45:00${offset}`)
    });

    expect(result).toEqual(expect.objectContaining({
      isWholeDayEvent: false,
      content: {
        summary: 'Event 1',
        description: null,
        location: null
      }
    }));
  });

  test('the second event, event 1 is today but today in the past', async () => {
    const events = normaliseEvents(calendarEvents as RawCalendarEvent[]);

    const result = findActiveEvent(events, {
      now: new Date(`2023-12-14T14:15:00${offset}`)
    });

    expect(result).toEqual(expect.objectContaining({
      isWholeDayEvent: false,
      content: {
        summary: 'Event 2',
        description: null,
        location: null
      }
    }));
  });
});
