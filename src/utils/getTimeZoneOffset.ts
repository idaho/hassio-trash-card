const getTimeZoneOffset = (now: Date = new Date()): string => {
  const offset = -now.getTimezoneOffset();

  const hours = Number.parseInt(`${offset / 60}`, 10);

  const formattedHours = hours < 0 ?
    `-${`${Number.parseInt(`${offset / 60}`, 10) * -1}`.padStart(2, '0')}` :
    `${Number.parseInt(`${offset / 60}`, 10)}`.padStart(2, '0');

  const minutes = offset % 60;

  return `${offset >= 0 ? '+' : ''}${formattedHours}:${`${minutes < 0 ? minutes * -1 : minutes}`.padStart(2, '0')}`;
};

export {
  getTimeZoneOffset
};
