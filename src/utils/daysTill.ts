import type { CalendarItem } from './calendarItem';

const daysTill = (from: Date, item: CalendarItem) => {
  const oneDay = 24 * 60 * 60 * 1_000;

  const todayMorning = new Date(from.getTime());

  todayMorning.setHours(0);
  todayMorning.setMinutes(0);
  todayMorning.setSeconds(0);

  const startTimeMorning = new Date(item.date.start.getTime());

  startTimeMorning.setHours(0);
  startTimeMorning.setMinutes(0);
  startTimeMorning.setSeconds(0);

  return Math.round(Math.abs((todayMorning.getTime() - startTimeMorning.getTime()) / oneDay));
};

export {
  daysTill
};
