import { assign, boolean, integer, literal, object, optional, string, union } from 'superstruct';
import { defaultConfigStruct } from '../../utils/form/defaultConfigStruct';

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
   settings?: {
     organic?: ItemSettings;
     paper?: ItemSettings;
     recycle?: ItemSettings;
     waste?: ItemSettings;
     others?: ItemSettings;
   };
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
   refresh_rate?: number;
   debug?: boolean;
 };

 type CardStyleConfig = Pick<TrashCardConfig, 'hide_time_range' | 'day_style' | 'color_mode' | 'layout'>;

const entityCardConfigStruct = assign(
  defaultConfigStruct,
  object({
    entity: optional(string()),
    name: optional(string()),
    layout: optional(union([ literal('horizontal'), literal('vertical'), literal('default') ])),
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
    day_style: optional(union([ literal(DAYSTYLES[0]), literal(DAYSTYLES[1]) ])),
    card_style: optional(union([ literal(CARDSTYLES[0]), literal(CARDSTYLES[1]) ])),
    color_mode: optional(union([ literal(COLORMODES[0]), literal(COLORMODES[1]) ])),
    debug: optional(boolean()),

    settings: optional(
      object({
        organic: optional(
          object({
            color: optional(string()),
            icon: optional(string()),
            label: optional(string()),
            pattern: optional(string())
          })
        ),
        paper: optional(
          object({
            color: optional(string()),
            icon: optional(string()),
            label: optional(string()),
            pattern: optional(string())
          })
        ),
        recycle: optional(
          object({
            color: optional(string()),
            icon: optional(string()),
            label: optional(string()),
            pattern: optional(string())
          })
        ),
        waste: optional(
          object({
            color: optional(string()),
            icon: optional(string()),
            label: optional(string()),
            pattern: optional(string())
          })
        ),
        others: optional(
          object({
            color: optional(string()),
            icon: optional(string())
          })
        )
      })
    )
  })
);

export {
  entityCardConfigStruct,
  DAYSTYLES,
  COLORMODES,
  CARDSTYLES
};

export type {
  TrashCardConfig,
  CardStyleConfig
};

