import setupCustomlocalize from '../localize';
import { getDayFromDate } from './getDayFromDate';

import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';
import type { HomeAssistant } from './ha';
import type { CalendarItem } from './calendarItem';

const getDateString = (item: CalendarItem, excludeTime?: boolean, config?: TrashCardConfig, hass?: HomeAssistant): string => {
  if (!hass || !config) {
    return '';
  }

  const customLocalize = setupCustomlocalize(hass);

  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayDay = getDayFromDate(today);
  const tomorrowDay = getDayFromDate(tomorrow);

  const stateDay = getDayFromDate(item.date.start);

  const startTime = !item.isWholeDayEvent ?
    item.date.start.toLocaleTimeString(hass.language, {
      hour: 'numeric',
      minute: 'numeric'
    }) :
    undefined;

  const endTime = !item.isWholeDayEvent ?
    item.date.end.toLocaleTimeString(hass.language, {
      hour: 'numeric',
      minute: 'numeric'
    }) :
    undefined;

  if (stateDay === todayDay || stateDay === tomorrowDay) {
    const key = `card.trash.${stateDay === todayDay ? 'today' : 'tomorrow'}${startTime && !excludeTime ? '_from_till' : ''}`;

    return `${customLocalize(`${key}`).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '')}`;
  }

  if (config.day_style === 'counter') {
    const oneDay = 24 * 60 * 60 * 1_000;

    const todayMorning = new Date();

    todayMorning.setHours(0);
    todayMorning.setMinutes(0);
    todayMorning.setSeconds(0);

    const daysLeft = Math.round(Math.abs((todayMorning.getTime() - item.date.start.getTime()) / oneDay));

    return `${customLocalize(`card.trash.daysleft${daysLeft > 1 ? '_more' : ''}${startTime && !excludeTime ? '_from_till' : ''}`).replace('<DAYS>', `${daysLeft}`).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '')}`;
  }

  const day = item.date.start.toLocaleDateString(hass.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const key = `card.trash.day${startTime && !excludeTime ? '_from_till' : ''}`;

  return customLocalize(`${key}`).replace('<DAY>', day).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '');
};

export {
  getDateString
};
