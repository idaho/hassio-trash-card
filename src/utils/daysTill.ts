import type { CalendarItem } from './calendarItem';

const daysTill = (item: CalendarItem) => {
  const oneDay = 24 * 60 * 60 * 1_000;

  const todayMorning = new Date();

  todayMorning.setHours(0);
  todayMorning.setMinutes(0);
  todayMorning.setSeconds(0);

  return Math.round(Math.abs((todayMorning.getTime() - item.date.start.getTime()) / oneDay));
};

export {
  daysTill
};
