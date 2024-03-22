import { getTimeZoneOffset } from './getTimeZoneOffset';

describe('getTimeZoneOffset', (): void => {
  test.each([
    [ '+01:00', -60 ],
    [ '+01:30', -90 ],
    [ '+01:45', -105 ],
    [ '+02:00', -120 ],
    [ '-01:00', 60 ],
    [ '-01:30', 90 ],
    [ '-01:45', 105 ],
    [ '-02:00', 120 ]
  ])('timezone should be %s', async (timezoneOffset, val) => {
    const date = new Date(`2023-12-10T00:00:00${timezoneOffset}`);

    // eslint-disable-next-line no-extend-native
    Date.prototype.getTimezoneOffset = () => val;

    const result = getTimeZoneOffset(date);

    // Const result = date.setTimeZoneOffset();

    expect(result).toEqual(timezoneOffset);
  });
});
