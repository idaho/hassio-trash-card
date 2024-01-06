import type { CalendarItem } from './calendarItem';

const filterDuplicatedItems = (items: CalendarItem[]): CalendarItem[] => {
  const alreadyNoted = new Set<string>([]);

  return items.filter(item => {
    const { type } = item;

    if (alreadyNoted.has(type)) {
      return false;
    }

    if (type === 'others') {
      const { content } = item;
      const key = content.recurrence_id ?? content.summary;

      if (alreadyNoted.has(key)) {
        return false;
      }
      alreadyNoted.add(key);

      return true;
    }

    alreadyNoted.add(type);

    return true;
  });
};

export {
  filterDuplicatedItems
};
