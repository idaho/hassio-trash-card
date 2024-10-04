import { array, assign, boolean, integer, literal, object, optional, string, union } from 'superstruct';
import { defaultConfigStruct } from '../../utils/form/defaultConfigStruct';

import type { ItemSettings } from '../../utils/itemSettings';

const LAYOUTS = [
  'default',
  'horizontal',
  'vertical'
] as const;

const LAYOUT_ICONS: Record<typeof LAYOUTS[number], string> = {
  default: 'mdi:card-text-outline',
  vertical: 'mdi:focus-field-vertical',
  horizontal: 'mdi:focus-field-horizontal'
};

const DAYSTYLES = [
  'default',
  'counter',
  'weekday',
  'custom'
] as const;

const CARDSTYLES = [
  'card',
  'chip',
  'icon'
] as const;

const ALIGNMENTSTYLES = [
  'left',
  'center',
  'right',
  'space'
] as const;

const COLORMODES = [
  'background',
  'icon'
] as const;

interface TrashCardConfig {
  entities: string[];
  pattern?: ItemSettings[];
  next_days?: number;
  items_per_row?: number;
  filter_events?: boolean;
  full_size?: boolean;
  drop_todayevents_from?: string;
  use_summary?: boolean;
  hide_time_range?: boolean;
  event_grouping?: boolean;
  day_style?: typeof DAYSTYLES[number];
  day_style_format?: string;
  card_style?: typeof CARDSTYLES[number];
  alignment_style?: typeof ALIGNMENTSTYLES[number];
  color_mode?: typeof COLORMODES[number] | 'badge';
  refresh_rate?: number;
  icon_size?: number;
  debug?: boolean;
  with_label?: boolean;
  index?: number;
  view_index?: number;
  view_layout?: any;
  layout: any;
  type: string;
}

 type CardStyleConfig = Pick<TrashCardConfig, 'hide_time_range' | 'day_style' | 'day_style_format' | 'layout' | 'color_mode' | 'icon_size' | 'with_label'>;

const entityCardConfigStruct = assign(
  defaultConfigStruct,
  object({
    entities: optional(array(string())),
    name: optional(string()),
    layout: optional(union([ literal(LAYOUTS[0]), literal(LAYOUTS[1]), literal(LAYOUTS[2]) ])),
    fill_container: optional(boolean()),
    filter_events: optional(boolean()),
    full_size: optional(boolean()),
    use_summary: optional(boolean()),
    hide_time_range: optional(boolean()),
    next_days: optional(integer()),
    items_per_row: optional(integer()),
    refresh_rate: optional(integer()),
    drop_todayevents_from: optional(string()),
    event_grouping: optional(boolean()),
    day_style: optional(union([ literal(DAYSTYLES[0]), literal(DAYSTYLES[1]), literal(DAYSTYLES[2]), literal(DAYSTYLES[3]) ])),
    day_style_format: optional(string()),
    card_style: optional(union([ literal(CARDSTYLES[0]), literal(CARDSTYLES[1]), literal(CARDSTYLES[2]) ])),
    alignment_style: optional(union([ literal(ALIGNMENTSTYLES[0]), literal(ALIGNMENTSTYLES[1]), literal(ALIGNMENTSTYLES[2]), literal(ALIGNMENTSTYLES[3]) ])),
    color_mode: optional(union([ literal(COLORMODES[0]), literal(COLORMODES[1]) ])),
    debug: optional(boolean()),
    icon_size: optional(integer()),
    with_label: optional(boolean()),

    pattern: optional(array(
      object({
        color: optional(string()),
        icon: optional(string()),
        label: optional(string()),
        pattern: optional(string()),
        pattern_exact: optional(boolean()),
        picture: optional(string()),
        type: string()
      })
    ))
  })
);

export {
  entityCardConfigStruct,
  DAYSTYLES,
  COLORMODES,
  CARDSTYLES,
  ALIGNMENTSTYLES,
  LAYOUTS,
  LAYOUT_ICONS
};

export type {
  TrashCardConfig,
  CardStyleConfig
};

