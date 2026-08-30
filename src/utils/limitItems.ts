import type { CalendarItem } from './calendarItem';

const limitItems = (items: CalendarItem[], maxItems?: number): CalendarItem[] => {
  if (maxItems === undefined || maxItems <= 0) {
    return items;
  }

  return items.slice(0, maxItems);
};

export {
  limitItems
};
