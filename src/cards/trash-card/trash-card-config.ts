import type { EntitySharedConfig } from 'lovelace-mushroom/src/shared/config/entity-config';
import type { ItemSettings } from '../../utils/itemSettings';
import { layoutStruct } from 'lovelace-mushroom/src/utils/layout';
import type { LovelaceCardConfig } from 'lovelace-mushroom/src/ha';
import { lovelaceCardConfigStruct } from 'lovelace-mushroom/src/shared/config/lovelace-card-config';
import { assign, boolean, integer, object, optional, string } from 'superstruct';

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
};

export const entityCardConfigStruct = assign(
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
    next_days: optional(integer()),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    drop_todayevents_from: optional(string()),

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
