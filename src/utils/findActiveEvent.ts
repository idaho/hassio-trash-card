import type { CalendarEvent } from './calendarEvents';
import { getDayFromDate } from './getDayFromDate';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

interface Config {
  settings: Required<TrashCardConfig>['settings'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filter_events: TrashCardConfig['filter_events'];
}

interface Options {
  config: Config;
  now: Date;
  dropAfter: boolean;
}

const isMatchingAnyPatterns = (item: CalendarEvent, config: Config) => {
  if (!config.filter_events) {
    return true;
  }

  const trashTypes = Object.keys(config.settings).filter(type => type !== 'others');
  const patterns = trashTypes.map(type => Reflect.get(config.settings, type).pattern!).filter(pattern => pattern !== null);

  return patterns.length === 0 || patterns.find(pattern => item.content.summary.includes(pattern));
};

const isNotPastWholeDayEvent = (item: CalendarEvent, now: Date, dropAfter: boolean): boolean =>
  (item.isWholeDayEvent && getDayFromDate(item.date.start) === getDayFromDate(now) && !dropAfter) ||
    (item.isWholeDayEvent && getDayFromDate(item.date.start) !== getDayFromDate(now));

const findActiveEvent = (items: CalendarEvent[], { config, now, dropAfter }: Options): CalendarEvent | undefined => {
  const activeItems = items.
    filter((item): boolean => {
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
    find((item): boolean =>
      isMatchingAnyPatterns(item, config) &&
    (isNotPastWholeDayEvent(item, now, dropAfter) ||
      !item.isWholeDayEvent));
};

export {
  findActiveEvent
};
