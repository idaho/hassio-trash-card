import { daysTill } from './daysTill';

import type { LocalizeFunc } from './ha';
import type { CalendarItem } from './calendarItem';

const counterString = (
  item: CalendarItem,
  excludeTime: boolean | undefined,
  startTime: string | undefined,
  endTime: string | undefined,
  customLocalize: LocalizeFunc
): string => {
  const daysToStart = daysTill(new Date(), item.date.start);

  if (daysToStart > 0) {
    const daysLeft = daysToStart;

    return `${customLocalize(`card.trash.daysleft${daysLeft > 1 ? '_more' : ''}${startTime && !excludeTime ? '_from_till' : ''}`).replace('<DAYS>', `${daysLeft}`).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '')}`;
  }
  const daysToEnd = daysTill(new Date(), item.date.end);

  return `${customLocalize(`card.trash.daysleftend${daysToEnd > 1 ? '_more' : ''}${startTime && !excludeTime ? '_till' : ''}`).replace('<DAYS>', `${daysToEnd}`).replace('<END>', endTime ?? '')}`;
};

export {
  counterString
};
