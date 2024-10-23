const daysTill = (from: Date, to: Date) => {
  const oneDay = 24 * 60 * 60 * 1_000;

  const todayMorning = new Date(from.getTime());

  todayMorning.setHours(0);
  todayMorning.setMinutes(0);
  todayMorning.setSeconds(0);

  const toTimeMorning = new Date(to.getTime());

  toTimeMorning.setHours(0);
  toTimeMorning.setMinutes(0);
  toTimeMorning.setSeconds(0);

  return Math.round((toTimeMorning.getTime() - todayMorning.getTime()) / oneDay);
};

export {
  daysTill
};
