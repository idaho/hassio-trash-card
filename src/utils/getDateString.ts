import setupCustomlocalize from '../localize';
import { getDayFromDate } from './getDayFromDate';
import { daysTill } from './daysTill';
import { counterString } from './counterString';
import { DateTime } from 'luxon';

import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';
import type { HomeAssistant } from './ha';
import type { CalendarItem } from './calendarItem';

const format = (date: Date, dateStyleFormat: string, language: string) =>
  DateTime.fromJSDate(date).setLocale(language).toFormat(dateStyleFormat);

const PLACEHOLDER_PATTERN = /\{\{(?<name>[^{}]+)\}\}/gu;
const MARKER_PATTERN = /\uE000(?<index>\d+)\uE001/gu;

type PlaceholderResolvers = Partial<Record<string, () => string>>;

const formatWithPlaceholders = (
  date: Date,
  dateStyleFormat: string,
  language: string,
  resolvers: PlaceholderResolvers
): string => {
  // Normal custom-date formats keep the existing, direct Luxon path.
  if (!dateStyleFormat.includes('{{')) {
    return format(date, dateStyleFormat, language);
  }

  const values: string[] = [];
  const resolved = new Map<string, string>();

  const luxonFormat = dateStyleFormat.replace(
    PLACEHOLDER_PATTERN,
    (rawPlaceholder, name: string) => {
      let value = rawPlaceholder;
      const resolver = resolvers[name];

      if (resolver) {
        if (!resolved.has(name)) {
          resolved.set(name, resolver());
        }

        value = resolved.get(name) ?? rawPlaceholder;
      }

      const marker = `\uE000${values.length}\uE001`;

      values.push(value);

      // Quoted so Luxon must treat the internal marker as literal content.
      return `'${marker}'`;
    }
  );

  return format(date, luxonFormat, language).replace(
    MARKER_PATTERN,
    (marker, index: string) => values[Number(index)] ?? marker
  );
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
    return getTimeString(customLocalize, stateDay === todayDay ? 'today' : 'tomorrow', undefined, startTime, endTime, excludeTime, false);
  }

  if (dayStyle === 'counter') {
    return counterString(
      item,
      excludeTime,
      startTime,
      endTime,
      customLocalize
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
    (() => {
      const customDateFormat = dayStyleFormat ?? 'dd.mm.YYYY';

      const dateForCustomFormat =
        customDateFormat.includes('{{') &&
        daysTill(today, item.date.start) <= 0 ?
          item.date.end :
          item.date.start;

      return formatWithPlaceholders(
        dateForCustomFormat,
        customDateFormat,
        hass.language,
        {
          counter: () => counterString(item, true, startTime, endTime, customLocalize)
        }
      );
    })();

  return getTimeString(customLocalize, 'day', day, startTime, endTime, excludeTime, false);
};

export {
  getDateString
};
