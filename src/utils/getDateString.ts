import setupCustomlocalize from '../localize';
import { getDayFromDate } from './getDayFromDate';
import { daysTill } from './daysTill';

import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';
import type { HomeAssistant } from './ha';
import type { CalendarItem } from './calendarItem';

const format = (date: Date, dateStyleFormat: string) => {
  const dateParts = {
    // eslint-disable-next-line id-length
    M: date.getMonth() + 1,
    // eslint-disable-next-line id-length
    d: date.getDate(),
    // eslint-disable-next-line id-length
    h: date.getHours(),
    // eslint-disable-next-line id-length
    m: date.getMinutes(),
    // eslint-disable-next-line id-length
    s: date.getSeconds()
  };

  // eslint-disable-next-line prefer-named-capture-group, no-param-reassign
  dateStyleFormat = dateStyleFormat.replace(/(M+|d+|h+|m+|s+)/ug, val => `${val.length > 1 ? '0' : ''}${dateParts[val.slice(-1)]}`.slice(-2));

  // eslint-disable-next-line prefer-named-capture-group
  return dateStyleFormat.replace(/(y+)/gu, val => date.getFullYear().toString().slice(-val.length));
};

const getTimeString = (customLocalize, offset: string, day?: string, startTime?: string, endTime?: string, excludeTime?: boolean, short?: boolean) => {
  if (offset === 'today' || offset === 'tomorrow') {
    const key = `card.trash.${offset}${startTime && !excludeTime ? '_from_till' : ''}${startTime && !excludeTime && short ? '_short' : ''}`;

    return `${customLocalize(`${key}`).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '')}`;
  }

  const key = `card.trash.day${startTime && !excludeTime ? '_from_till' : ''}${startTime && !excludeTime && short ? '_short' : ''}`;

  return customLocalize(`${key}`).replace('<DAY>', day).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '');
};

const getDateString = (
  item: CalendarItem,
  excludeTime?: boolean,
  dayStyle?: TrashCardConfig['day_style'],
  dayStyleFormat?: TrashCardConfig['day_style_format'],
  hass?: HomeAssistant
): string => {
  if (!hass) {
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
    return getTimeString(customLocalize, stateDay === todayDay ? 'today' : 'tomorrow', undefined, startTime, endTime, excludeTime, true);
  }

  if (dayStyle === 'counter') {
    const daysLeft = daysTill(new Date(), item);

    return `${customLocalize(`card.trash.daysleft${daysLeft > 1 ? '_more' : ''}${startTime && !excludeTime ? '_from_till' : ''}`).replace('<DAYS>', `${daysLeft}`).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '')}`;
  }
  const day = dayStyle !== 'custom' ?
    item.date.start.toLocaleDateString(hass.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) :
    format(item.date.start, dayStyleFormat ?? 'dd.mm.YYYY');

  return getTimeString(customLocalize, 'day', day, startTime, endTime, excludeTime, true);
};

export {
  getDateString
};
