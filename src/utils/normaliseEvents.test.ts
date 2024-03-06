/* eslint-disable @typescript-eslint/naming-convention */
import calendarEvents from '../../mocks/calendarData.json';
import { getTimeZoneOffset } from './getTimeZoneOffset';
import { normaliseEvents } from './normaliseEvents';

import type { RawCalendarEvent } from './calendarEvents';

describe('normaliseEvents', (): void => {
  test('normaliseEvents', async () => {
    const timezoneOffset = getTimeZoneOffset();
    const result = normaliseEvents(calendarEvents as RawCalendarEvent[], timezoneOffset);

    const expectedResult = [
      {
        date: {
          start: new Date(`2023-12-10T00:00:00${timezoneOffset}`),
          end: new Date(`2023-12-11T00:00:00${timezoneOffset}`)
        },
        isWholeDayEvent: true,
        content: {
          summary: 'BIO',
          description: null,
          location: null
        }
      },
      {
        date: {
          start: new Date('2023-12-14T13:10:00+01:00'),
          end: new Date('2023-12-14T14:10:00+01:00')
        },
        isWholeDayEvent: false,
        content: {
          summary: 'Event 1',
          description: null,
          location: null
        }
      },
      {
        date: {
          start: new Date('2023-12-18T09:10:00+01:00'),
          end: new Date('2023-12-18T10:10:00+01:00')
        },
        isWholeDayEvent: false,
        content: {
          summary: 'Event 2',
          description: null,
          location: null
        }
      },
      {
        date: {
          start: new Date('2023-12-18T18:00:00+01:00'),
          end: new Date('2023-12-18T19:00:00+01:00')
        },
        isWholeDayEvent: false,
        content: {
          summary: 'Event 3',
          description: null,
          location: null
        }
      }];

    expect(result).toEqual(expectedResult);
  });
});
