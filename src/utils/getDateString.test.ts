/* eslint-disable @typescript-eslint/naming-convention */

import setupCustomlocalize from '../localize';
import { counterString } from './counterString';
import { getDateString } from './getDateString';

import type { CalendarItem } from './calendarItem';
import type { HomeAssistant } from './ha';

const fixedNow = new Date('2025-01-08T12:00:00');

const makeHass = (language = 'en'): HomeAssistant =>
  ({
    language,
    locale: {
      language
    }
  } as unknown as HomeAssistant);

const makeItem = (
  start: string,
  end = start,
  isWholeDayEvent = true
): CalendarItem =>
  ({
    date: {
      start: new Date(start),
      end: new Date(end)
    },
    isWholeDayEvent,
    content: {
      summary: 'Test event',
      description: null,
      location: null,
      uid: 'test-event',
      recurrence_id: null,
      rrule: null,
      entity: 'calendar.test'
    },
    label: 'Test event',
    type: 'organic'
  } as CalendarItem);

describe('getDateString', (): void => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(fixedNow));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('combines the counter placeholder with a Luxon date format', () => {
    const result = getDateString(
      makeItem('2025-01-10T00:00:00'),
      true,
      'custom',
      '{{counter}} \'on\' dd.MM.yyyy',
      makeHass()
    );

    expect(result).toBe('in 2 days on 10.01.2025');
  });

  test('combines the counter placeholder with the Luxon weekday format', () => {
    const result = getDateString(
      makeItem('2025-01-10T00:00:00'),
      true,
      'custom',
      '{{counter}} (cccc)',
      makeHass()
    );

    expect(result).toBe('in 2 days (Friday)');
  });

  test('resolves repeated counter placeholders consistently', () => {
    const result = getDateString(
      makeItem('2025-01-10T00:00:00'),
      true,
      'custom',
      '{{counter}} / {{counter}}',
      makeHass()
    );

    expect(result).toBe('in 2 days / in 2 days');
  });

  test('keeps unknown placeholders unchanged', () => {
    const result = getDateString(
      makeItem('2025-01-10T00:00:00'),
      true,
      'custom',
      '{{not_supported}} dd.MM.yyyy',
      makeHass()
    );

    expect(result).toBe('{{not_supported}} 10.01.2025');
  });

  test('uses the direct Luxon formatting path when no placeholder is present', () => {
    const result = getDateString(
      makeItem('2025-01-10T00:00:00'),
      true,
      'custom',
      'yyyy-MM-dd',
      makeHass()
    );

    expect(result).toBe('2025-01-10');
  });

  test('preserves the counter day style output', () => {
    const result = getDateString(
      makeItem('2025-01-10T00:00:00'),
      true,
      'counter',
      undefined,
      makeHass()
    );

    expect(result).toBe('in 2 days');
  });

  test('Today takes precedence over a custom format containing the counter placeholder', () => {
    const result = getDateString(
      makeItem('2025-01-08T00:00:00'),
      true,
      'custom',
      '{{counter}} \'on\' dd.MM.yyyy',
      makeHass()
    );

    expect(result).toBe('today');
  });

  test('Tomorrow takes precedence over a custom format containing the counter placeholder', () => {
    const result = getDateString(
      makeItem('2025-01-09T00:00:00'),
      true,
      'custom',
      '{{counter}} \'on\' dd.MM.yyyy',
      makeHass()
    );

    expect(result).toBe('tomorrow');
  });

  test('renders a timed event range only once with a counter placeholder', () => {
    const item = makeItem(
      '2025-01-10T10:15:00',
      '2025-01-10T11:45:00',
      false
    );
    const hass = makeHass();

    const result = getDateString(
      item,
      false,
      'custom',
      '{{counter}} \'on\' dd.MM.yyyy',
      hass
    );

    const startTime = item.date.start.toLocaleTimeString(hass.language, {
      hour: 'numeric',
      minute: 'numeric'
    });
    const endTime = item.date.end.toLocaleTimeString(hass.language, {
      hour: 'numeric',
      minute: 'numeric'
    });

    expect(result).toBe(
      `in 2 days on 10.01.2025\nbetween ${startTime} and ${endTime}`
    );
    expect(result.split(startTime)).toHaveLength(2);
    expect(result.split(endTime)).toHaveLength(2);
  });

  test('uses the start date for a future multi-day event', () => {
    const result = getDateString(
      makeItem(
        '2025-01-10T00:00:00',
        '2025-01-11T00:00:00'
      ),
      true,
      'custom',
      '{{counter}} \'on\' dd.MM.yyyy',
      makeHass()
    );

    expect(result).toBe('in 2 days on 10.01.2025');
  });

  test('uses the daysleftend translation when the event has already started', () => {
    const result = getDateString(
      makeItem('2025-01-07T00:00:00', '2025-01-10T00:00:00'),
      true,
      'custom',
      '{{counter}} (dd.MM.yyyy)',
      makeHass()
    );

    expect(result).toBe('ends in 2 days (10.01.2025)');
  });
});

describe('counterString', (): void => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(fixedNow));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('uses the singular translation for one day', () => {
    const hass = makeHass();
    const localize = setupCustomlocalize(hass);

    const result = counterString(
      makeItem('2025-01-09T00:00:00'),
      true,
      undefined,
      undefined,
      localize
    );

    expect(result).toBe('in 1 day');
  });

  test('uses the plural translation for multiple days', () => {
    const hass = makeHass();
    const localize = setupCustomlocalize(hass);

    const result = counterString(
      makeItem('2025-01-10T00:00:00'),
      true,
      undefined,
      undefined,
      localize
    );

    expect(result).toBe('in 2 days');
  });
});
