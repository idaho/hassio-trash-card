import type { EntitySharedConfig } from 'lovelace-mushroom/src/shared/config/entity-config';
import { layoutStruct } from 'lovelace-mushroom/src/utils/layout';
import type { LovelaceCardConfig } from 'lovelace-mushroom/src/ha';
import { lovelaceCardConfigStruct } from 'lovelace-mushroom/src/shared/config/lovelace-card-config';
import { assign, boolean, object, optional, string } from 'superstruct';

export interface TrashItem {
  label?: string;
  color?: string;
  pattern?: string;
  icon?: string;
}

type EntityWithOutIcon = Omit<EntitySharedConfig, 'icon'>;
export type TrashCardConfig = LovelaceCardConfig &
EntityWithOutIcon & {
  settings?: {
    organic?: TrashItem;
    paper?: TrashItem;
    recycle?: TrashItem;
    waste?: TrashItem;
    others?: TrashItem;
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  full_size?: boolean;
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
    full_size: optional(boolean()),
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
