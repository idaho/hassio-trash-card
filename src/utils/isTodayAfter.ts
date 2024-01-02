const isTodayAfter = (now: Date, dropAfter: string): boolean => {
  const [ hours, minutes, seconds ] = dropAfter.split(':');

  if (now.getHours() < Number(hours)) {
    return false;
  }
  if (now.getHours() > Number(hours)) {
    return true;
  }

  if (now.getMinutes() > Number(minutes)) {
    return true;
  }
  if (now.getSeconds() >= Number(seconds)) {
    return true;
  }

  return false;
};

export {
  isTodayAfter
};
