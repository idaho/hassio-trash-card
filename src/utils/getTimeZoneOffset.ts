const getTimeZoneOffset = (): string => {
  const now = new Date();

  const offset = -now.getTimezoneOffset();
  const hours = Number.parseInt(`${offset / 60}`, 10);

  const formattedHours = hours < 0 ?
    `-${`${Number.parseInt(`${offset / 60}`, 10) * -1}`.padStart(2, '0')}` :
    `${Number.parseInt(`${offset / 60}`, 10)}`.padStart(2, '0');

  return `${offset >= 0 ? '+' : ''}${formattedHours}:${`${offset % 60}`.padStart(2, '0')}`;
};

export {
  getTimeZoneOffset
};
