/* eslint-disable @typescript-eslint/naming-convention */
import calendarEvents from '../../mocks/calendarData.json';
import { findActiveEvent } from './findActiveEvent';
import { getTimeZoneOffset } from './getTimeZoneOffset';
import { normaliseEvents } from './normaliseEvents';
import type { RawCalendarEvent } from './calendarEvents';

describe('findActiveEvent', (): void => {
  const offset = getTimeZoneOffset();
  const emptyConfig = {
    settings: {},
    filter_events: undefined
  };

  test('the whole day event today cause its before 10 o`clock', async () => {
    const events = normaliseEvents(calendarEvents as RawCalendarEvent[]);

    const result = findActiveEvent(events, {
      config: emptyConfig,
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
      config: emptyConfig,
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
      config: emptyConfig,
      now: new Date(`2023-12-14T13:45:00+01:00`)
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

  test('the second event, event 2 is today but today in the past', async () => {
    const events = normaliseEvents(calendarEvents as RawCalendarEvent[]);

    const result = findActiveEvent(events, {
      config: emptyConfig,
      now: new Date(`2023-12-14T14:15:00+01:00`)
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

  test('the last event, event 3 is matching the pattern', async () => {
    const events = normaliseEvents(calendarEvents as RawCalendarEvent[]);

    const result = findActiveEvent(events, {
      config: {
        settings: {
          recycle: {
            pattern: 'Event 3'
          }
        },
        filter_events: true
      },
      now: new Date(`2023-12-14T14:15:00+01:00`)
    });

    expect(result).toEqual(expect.objectContaining({
      isWholeDayEvent: false,
      content: {
        summary: 'Event 3',
        description: null,
        location: null
      }
    }));
  });

  test('the second event, event 2 is today but today in the past and filtering is off', async () => {
    const events = normaliseEvents(calendarEvents as RawCalendarEvent[]);

    const result = findActiveEvent(events, {
      config: {
        settings: {
          recycle: {
            pattern: 'Event 3'
          }
        },
        filter_events: false
      },
      now: new Date(`2023-12-14T14:15:00+01:00`)
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
