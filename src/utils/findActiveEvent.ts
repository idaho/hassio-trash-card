import type { CalendarEvent } from './calendarEvents';
import { getDayFromDate } from './getDayFromDate';

interface Options {
  now: Date;
}

const findActiveEvent = (items: CalendarEvent[], { now }: Options): CalendarEvent | undefined => {
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
      (item.isWholeDayEvent && getDayFromDate(item.date.start) === getDayFromDate(now) && now.getHours() < 10) ||
    (item.isWholeDayEvent && getDayFromDate(item.date.start) !== getDayFromDate(now)) ||
    !item.isWholeDayEvent);
};

export {
  findActiveEvent
};
