/* eslint-disable @typescript-eslint/naming-convention */
import { isTodayAfter } from './isTodayAfter';

describe('isTodayAfter', (): void => {
  test('11:10:00 is after 11:00:00', async () => {
    const date = new Date(`1970-01-01T11:10:00.000`);

    const result = isTodayAfter(date, '11:00:00');

    expect(result).toEqual(true);
  });

  test('11:10:00 is before 11:10:01', async () => {
    const date = new Date(`1970-01-01T11:10:00.000`);

    const result = isTodayAfter(date, '11:10:01');

    expect(result).toEqual(false);
  });
});
