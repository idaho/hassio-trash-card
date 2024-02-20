import { layoutStruct } from 'lovelace-mushroom/src/utils/layout';
import { lovelaceCardConfigStruct } from 'lovelace-mushroom/src/shared/config/lovelace-card-config';
import { array, assign, boolean, integer, literal, object, optional, string, union } from 'superstruct';

import type { EntitySharedConfig } from 'lovelace-mushroom/src/shared/config/entity-config';
import type { ItemSettings } from '../../utils/itemSettings';
import type { LovelaceCardConfig } from 'lovelace-mushroom/src/ha';

const DAYSTYLES = [
  'default',
  'counter'
] as const;

const CARDSTYLES = [
  'card',
  'chip'
] as const;

const COLORMODES = [
  'background',
  'icon'
] as const;

type EntityWithOutIcon = Omit<EntitySharedConfig, 'icon'>;

 type TrashCardConfig = LovelaceCardConfig &
 EntityWithOutIcon & {
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
   card_style?: typeof CARDSTYLES[number];
   color_mode?: typeof COLORMODES[number];
 };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
const entityCardConfigStruct = assign(
  lovelaceCardConfigStruct,
  object({
    entity: optional(string()),
    name: optional(string()),
    layout: optional(layoutStruct),
    fill_container: optional(boolean()),
    filter_events: optional(boolean()),
    full_size: optional(boolean()),
    use_summary: optional(boolean()),
    hide_time_range: optional(boolean()),
    next_days: optional(integer()),
    items_per_row: optional(integer()),
    drop_todayevents_from: optional(string()),
    event_grouping: optional(boolean()),
    day_style: optional(union([ literal(DAYSTYLES[0]), literal(DAYSTYLES[1]) ])),
    card_style: optional(union([ literal(CARDSTYLES[0]), literal(CARDSTYLES[1]) ])),
    color_mode: optional(union([ literal(COLORMODES[0]), literal(COLORMODES[1]) ])),
    pattern: optional(array(
      object({
        color: optional(string()),
        icon: optional(string()),
        label: optional(string()),
        pattern: optional(string()),
        type: string()
      })
    ))
  })
);

export {
  entityCardConfigStruct,
  DAYSTYLES,
  COLORMODES,
  CARDSTYLES
};

export type {
  TrashCardConfig
};

