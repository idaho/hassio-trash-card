/* eslint-disable @typescript-eslint/naming-convention */
import { limitItems } from './limitItems';

import type { CalendarItem } from './calendarItem';

const createItem = (uid: string): CalendarItem => ({
  date: {
    start: new Date(`1970-01-01T00:00:00.000`),
    end: new Date(`1970-01-02T00:00:00.000`)
  },
  isWholeDayEvent: true,
  content: {
    summary: uid,
    uid
  } as CalendarItem['content'],
  label: uid,
  type: 'others'
});

describe('limitItems', (): void => {
  const items = [ createItem('1'), createItem('2'), createItem('3'), createItem('4') ];

  test('returns all items if no limit is given', async () => {
    expect(limitItems(items)).toEqual(items);
  });

  test('returns all items if limit is 0', async () => {
    expect(limitItems(items, 0)).toEqual(items);
  });

  test('returns all items if limit is negative', async () => {
    expect(limitItems(items, -1)).toEqual(items);
  });

  test('returns only the first items if a limit is given', async () => {
    expect(limitItems(items, 2)).toEqual([ items[0], items[1] ]);
  });

  test('returns all items if the limit exceeds the number of items', async () => {
    expect(limitItems(items, 10)).toEqual(items);
  });
});
