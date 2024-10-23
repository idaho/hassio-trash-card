import setupCustomlocalize from '../localize';
import { getDayFromDate } from './getDayFromDate';
import { daysTill } from './daysTill';
import { DateTime } from 'luxon';

import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';
import type { HomeAssistant } from './ha';
import type { CalendarItem } from './calendarItem';

const format = (date: Date, dateStyleFormat: string, language: string) =>
  DateTime.fromJSDate(date).setLocale(language).toFormat(dateStyleFormat);

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
    return getTimeString(customLocalize, stateDay === todayDay ? 'today' : 'tomorrow', undefined, startTime, endTime, excludeTime, false);
  }

  if (dayStyle === 'counter') {
    const daysToStart = daysTill(new Date(), item.date.start);

    if (daysToStart > 0) {
      const daysLeft = daysToStart;

      return `${customLocalize(`card.trash.daysleft${daysLeft > 1 ? '_more' : ''}${startTime && !excludeTime ? '_from_till' : ''}`).replace('<DAYS>', `${daysLeft}`).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '')}`;
    }
    const daysToEnd = daysTill(new Date(), item.date.end);

    return `${customLocalize(`card.trash.daysleftend${daysToEnd > 1 ? '_more' : ''}${startTime && !excludeTime ? '_till' : ''}`).replace('<DAYS>', `${daysToEnd}`).replace('<END>', endTime ?? '')}`;
  }

  if (dayStyle === 'weekday') {
    return item.date.start.toLocaleDateString(hass.language, {
      weekday: 'long'
    });
  }

  const day = dayStyle !== 'custom' ?
    item.date.start.toLocaleDateString(hass.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) :
    format(item.date.start, dayStyleFormat ?? 'dd.mm.YYYY', hass.language);

  return getTimeString(customLocalize, 'day', day, startTime, endTime, excludeTime, false);
};

export {
  getDateString
};
