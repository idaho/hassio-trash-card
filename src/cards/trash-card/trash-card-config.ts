import type { EntitySharedConfig } from 'lovelace-mushroom/src/shared/config/entity-config';
import type { ItemSettings } from '../../utils/itemSettings';
import { layoutStruct } from 'lovelace-mushroom/src/utils/layout';
import type { LovelaceCardConfig } from 'lovelace-mushroom/src/ha';
import { lovelaceCardConfigStruct } from 'lovelace-mushroom/src/shared/config/lovelace-card-config';
import { assign, boolean, integer, literal, object, optional, string, union } from 'superstruct';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DAYSTYLES = [
  'default',
  'counter'
] as const;

type EntityWithOutIcon = Omit<EntitySharedConfig, 'icon'>;

export type TrashCardConfig = LovelaceCardConfig &
EntityWithOutIcon & {
  settings?: {
    organic?: ItemSettings;
    paper?: ItemSettings;
    recycle?: ItemSettings;
    waste?: ItemSettings;
    others?: ItemSettings;
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  next_days?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filter_events?: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  full_size?: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  drop_todayevents_from?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  use_summary?: boolean;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  day_style?: typeof DAYSTYLES[number];
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
const entityCardConfigStruct = assign(
  lovelaceCardConfigStruct,
  object({
    entity: optional(string()),
    name: optional(string()),
    layout: optional(layoutStruct),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    fill_container: optional(boolean()),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    filter_events: optional(boolean()),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    full_size: optional(boolean()),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    use_summary: optional(boolean()),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    next_days: optional(integer()),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    drop_todayevents_from: optional(string()),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    day_style: optional(union([ literal(DAYSTYLES[0]), literal(DAYSTYLES[1]) ])),

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
  entityCardConfigStruct
};
