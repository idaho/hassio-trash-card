import type { CalendarEvent } from './calendarEvents';
import { getDayFromDate } from './getDayFromDate';
import { isTodayAfter } from './isTodayAfter';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

interface Config {
  settings: Required<TrashCardConfig>['settings'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filter_events: TrashCardConfig['filter_events'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  drop_todayevents_from: Required<TrashCardConfig>['drop_todayevents_from'];
}

interface Options {
  config: Config;
  now: Date;
}

const isMatchingAnyPatterns = (item: CalendarEvent, config: Config) => {
  if (!config.filter_events) {
    return true;
  }

  const trashTypes = Object.keys(config.settings).filter(type => type !== 'others');
  const patterns = trashTypes.map(type => Reflect.get(config.settings, type).pattern!).filter(pattern => pattern !== null);

  return patterns.length === 0 || patterns.find(pattern => item.content.summary.includes(pattern));
};

const isNotPastWholeDayEvent = (item: CalendarEvent, now: Date, dropAfter: string): boolean =>
  (item.isWholeDayEvent && getDayFromDate(item.date.start) === getDayFromDate(now) && !isTodayAfter(now, dropAfter)) ||
    (item.isWholeDayEvent && getDayFromDate(item.date.start) !== getDayFromDate(now));

const findActiveEvent = (items: CalendarEvent[], { config, now }: Options): CalendarEvent | undefined => {
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
    (isNotPastWholeDayEvent(item, now, config.drop_todayevents_from) ||
      !item.isWholeDayEvent));
};

export {
  findActiveEvent
};
