import { getDayFromDate } from './getDayFromDate';
import { getTimeZoneOffset } from './getTimeZoneOffset';

import type { CalendarEvent } from './calendarEvents';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

interface Config {
  pattern: Required<TrashCardConfig>['pattern'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filter_events: TrashCardConfig['filter_events'];
}

interface Options {
  config: Config;
  now: Date;
  dropAfter: boolean;
  filterFutureEventsDay: string;
}

const isMatchingAnyPatterns = (item: CalendarEvent, config: Config) => {
  if (!config.filter_events) {
    return true;
  }

  const trashTypes = config.pattern.filter(pat => pat.type !== 'others');
  const patterns = trashTypes.map(pat => pat.pattern).filter(pattern => pattern !== undefined);

  return patterns.length === 0 || patterns.some(pattern => item.content.summary.toLowerCase().includes(pattern.toLowerCase()));
};

const isNotPastWholeDayEvent = (item: CalendarEvent, now: Date, dropAfter: boolean): boolean =>
  (item.isWholeDayEvent && getDayFromDate(item.date.start) === getDayFromDate(now) && !dropAfter) ||
    (item.isWholeDayEvent && getDayFromDate(item.date.start) !== getDayFromDate(now));

const findActiveEvents = (items: CalendarEvent[], { config, now, dropAfter, filterFutureEventsDay }: Options): CalendarEvent[] => {
  const dateString = `${filterFutureEventsDay}T00:00:00${getTimeZoneOffset()}`;
  const dateMaxStart = new Date(dateString);

  const activeItems = items.
    filter((item): boolean => {
      if (item.date.start > dateMaxStart) {
        return false;
      }

      if (item.isWholeDayEvent) {
        return item.date.end > now;
      }
      if (item.date.end < now) {
        return false;
      }

      return true;
    }).
    sort((first, second): number => first.date.start.getTime() - second.date.start.getTime());

  return activeItems.
    filter((item): boolean =>
      isMatchingAnyPatterns(item, config) &&
    (isNotPastWholeDayEvent(item, now, dropAfter) ||
      !item.isWholeDayEvent));
};

export {
  findActiveEvents
};
