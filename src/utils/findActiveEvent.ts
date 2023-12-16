import type { CalendarEvent } from './calendarEvents';
import { getDayFromDate } from './getDayFromDate';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

interface Options {
  settings: Required<TrashCardConfig>['settings'];
  now: Date;
}

const isMatchingAnyPatterns = (item: CalendarEvent, settings: Required<TrashCardConfig>['settings']) => {
  const trashTypes = Object.keys(settings).filter(type => type !== 'others');
  const patterns = trashTypes.map(type => Reflect.get(settings, type).pattern!).filter(pattern => pattern !== null);

  return patterns.length === 0 || patterns.find(pattern => item.content.summary.includes(pattern));
};

const isNotPastWholeDayEvent = (item: CalendarEvent, now: Date): boolean =>
  (item.isWholeDayEvent && getDayFromDate(item.date.start) === getDayFromDate(now) && now.getHours() < 10) ||
    (item.isWholeDayEvent && getDayFromDate(item.date.start) !== getDayFromDate(now));

const findActiveEvent = (items: CalendarEvent[], { settings, now }: Options): CalendarEvent | undefined => {
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
      isMatchingAnyPatterns(item, settings) &&
    (isNotPastWholeDayEvent(item, now) ||
      !item.isWholeDayEvent));
};

export {
  findActiveEvent
};
