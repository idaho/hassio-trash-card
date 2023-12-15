const getTimeZoneOffset = (): string => {
  const now = new Date();
  const offset = -now.getTimezoneOffset();

  return `${offset >= 0 ? '+' : ''}${`${Number.parseInt(`${offset / 60}`, 10)}`.padStart(2, '0')}:${`${offset % 60}`.padStart(2, '0')}`;
};

export {
  getTimeZoneOffset
};
