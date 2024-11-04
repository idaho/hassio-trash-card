import setupCustomlocalize from '../localize';
import { getDayFromDate } from './getDayFromDate';
import { daysTill } from './daysTill';
import { DateTime } from 'luxon';

import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';
import type { HomeAssistant, LocalizeKeys } from './ha';
import type { CalendarItem } from './calendarItem';

const format = (date: Date, dateStyleFormat: string, language: string) =>
  DateTime.fromJSDate(date).setLocale(language).toFormat(dateStyleFormat);

const getTimeString = (customLocalize, offset: string, day?: string, startTime?: string, endTime?: string, excludeTime?: boolean) => {
  const fromTill = startTime && !excludeTime ? '_from_till' : '';
  let translateKey: LocalizeKeys = `card.trash.day${fromTill}`;

  if (offset === 'today' || offset === 'tomorrow') {
    translateKey = `card.trash.${offset}${fromTill}`;
  }

  return customLocalize(translateKey, {
    DAY: day,
    START: startTime ?? '',
    END: endTime ?? ''
  });
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
    return getTimeString(customLocalize, stateDay === todayDay ? 'today' : 'tomorrow', undefined, startTime, endTime, excludeTime);
  }

  if (dayStyle === 'counter') {
    if (item.date.start.getTime() > Date.now()) {
      const daysToStart = daysTill(new Date(), item.date.start);
      const translateKey: LocalizeKeys = `card.trash.daysleft${daysToStart > 1 ? '_more' : ''}${startTime && !excludeTime ? '_from_till' : ''}`;

      return customLocalize(
        translateKey, {
          DAYS: daysToStart,
          START: startTime ?? '',
          END: endTime ?? ''
        }
      );
    }
    const daysToEnd = daysTill(new Date(), item.date.end);
    const translateKey: LocalizeKeys = `card.trash.daysleftend${daysToEnd > 1 ? '_more' : ''}${startTime && !excludeTime ? '_till' : ''}`;

    return customLocalize(
      translateKey, {
        DAYS: daysToEnd,
        END: endTime ?? ''
      }
    );
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

  return getTimeString(customLocalize, 'day', day, startTime, endTime, excludeTime);
};

export {
  getDateString
};
