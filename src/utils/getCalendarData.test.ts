import { getCalendarData } from './getCalendarData';
import * as findActiveEvents from './findActiveEvents';
import { Debugger } from './debugger';

import type { HomeAssistant } from './ha';

const data = [
  {
    content: {
      summary: 'event 1'
    }
  },
  {
    content: {
      summary: 'event 2'
    }
  }
];

describe(`getCalendarData`, () => {
  const testConfig = [ true, false ];

  test.each(testConfig)(`filter events based on item_count`, async use => {
    const ha: Partial<HomeAssistant> = {
      callApi: jest.fn().mockResolvedValue(data)
    };

    // @ts-expect-error mocked return value with only necessary fields for the test
    jest.spyOn(findActiveEvents, 'findActiveEvents').mockReturnValue(data);

    // @ts-expect-error mocked method call with only necessary fields for the test
    const result = await getCalendarData(ha as HomeAssistant, [], {}, new Debugger(), { use_item_count: use, item_count: 1, pattern: []}, '');

    expect(result).toHaveLength(use ? 1 : 2);
    expect(result[0].content.summary).toBe('event 1');
  });
});
