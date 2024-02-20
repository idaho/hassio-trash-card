import { any, number, object, optional, string } from 'superstruct';

const defaultConfigStruct = object({
  index: optional(number()),
  view_index: optional(number()),
  view_layout: any(),
  type: string()
});

export {
  defaultConfigStruct
};
