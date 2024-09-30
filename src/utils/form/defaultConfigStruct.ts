import { any, number, object, optional, string } from 'superstruct';

const defaultConfigStruct = object({
  index: optional(number()),
  view_index: optional(number()),
  view_layout: any(),
  type: string(),
  layout_options: any(),
  visibility: any()
});

export {
  defaultConfigStruct
};
