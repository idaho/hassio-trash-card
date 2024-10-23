/* eslint-disable @typescript-eslint/naming-convention */
import { daysTill } from './daysTill';

describe('daysTill', (): void => {
  test('2 days till whole day events', async () => {
    const date = new Date(`1970-01-02T00:00:00.000`);

    const item = new Date(`1970-01-04T00:00:00.000`);

    const result = daysTill(date, item);

    expect(result).toEqual(2);
  });

  test('2 days till event at the evening', async () => {
    const date = new Date(`1970-01-02T00:00:00.000`);

    const item = new Date(`1970-01-04T22:00:00.000`);

    const result = daysTill(date, item);

    expect(result).toEqual(2);
  });

  test('2 days till event during leap ear', async () => {
    const date = new Date(`2024-02-28T00:00:00.000`);

    const item = new Date(`2024-03-01T00:00:00.000`);

    const result = daysTill(date, item);

    expect(result).toEqual(2);
  });

  describe('calculate correct during time changeover', (): void => {
    test('from normal to day light saving', async () => {
      const date = new Date(`2024-03-30T00:00:00.000`);

      const item = new Date(`2024-04-01T00:00:00.000`);

      const result = daysTill(date, item);

      expect(result).toEqual(2);
    });

    test('from day light saving to normal', async () => {
      const date = new Date(`2024-10-26T00:00:00.000`);

      const item = new Date(`2024-10-29T00:00:00.000`);

      const result = daysTill(date, item);

      expect(result).toEqual(3);
    });
  });
});
