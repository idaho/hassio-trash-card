import { eventsToItems } from './eventsToItems';
import { findActiveEvents } from './findActiveEvents';
import { normaliseEvents } from './normaliseEvents';
import { filterDuplicatedItems } from './filterDuplicatedItems';

import type { Debugger } from './debugger';
import type { HomeAssistant } from './ha';
import type { RawCalendarEvent } from './calendarEvents';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

const getCalendarData = async (
  hass: HomeAssistant,
  calendar: string,
  { start, end, dropAfter }: { start: string; end: string; dropAfter: boolean },
  debuggerInstance: Debugger,
  config: TrashCardConfig,
  timezoneOffset: string
) => {
  const uri = `calendars/${calendar}?start=${start}&end=${end}`;

  const rawCalendarEvents = await hass.callApi<RawCalendarEvent[]>('GET', uri);

  debuggerInstance.reset();
  debuggerInstance.log(`timezone`, timezoneOffset);
  debuggerInstance.log(`calendar data`, rawCalendarEvents);

  const normalisedEvents = normaliseEvents(rawCalendarEvents, timezoneOffset);

  const now = new Date();

  debuggerInstance.log(`normaliseEvents`, normalisedEvents);
  debuggerInstance.log(`dropAfter`, dropAfter);
  debuggerInstance.log(`now`, now);

  const activeEvents = findActiveEvents(normalisedEvents, {
    config: {
      pattern: config.pattern!,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      filter_events: config.filter_events
    },
    dropAfter,
    now
  });

  debuggerInstance.log(`activeElements`, activeEvents);

  const eventItems = eventsToItems(activeEvents, {
    pattern: config.pattern!,
    useSummary: Boolean(config.use_summary)
  });

  debuggerInstance.log(`eventsToItems`, eventItems);

  return !config.event_grouping ?
    eventItems :
    filterDuplicatedItems(eventItems);
};

export {
  getCalendarData
};
