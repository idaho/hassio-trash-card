import { getDayFromDate } from './getDayFromDate';
import { getTimeZoneOffset } from './getTimeZoneOffset';

const isTodayAfter = (now: Date, dropAfter: string): boolean => {
  const [ hours, minutes, seconds ] = dropAfter.split(':');

  const dropAfterDateString = `${getDayFromDate(now)}T${hours}:${minutes}:${seconds}.000${getTimeZoneOffset()}`;
  const dropAfterDate = new Date(dropAfterDateString);

  return now > dropAfterDate;
};

export {
  isTodayAfter
};
