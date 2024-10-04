const hasEntities = (entites?: string[]): entites is string[] =>
  Boolean(entites && entites.length > 0);

export {
  hasEntities
};
