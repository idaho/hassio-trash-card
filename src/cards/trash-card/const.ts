import type { TrashItem } from './trash-card-config';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TRASH_CARD_NAME = `trash-card`;
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TRASH_CARD_EDITOR_NAME = `${TRASH_CARD_NAME}-editor`;

export type TrashDataItem = TrashItem & {
  type: string;
  data?: {
    summary: string;
  };
};

export interface TrashData {
  date: Date;
  item?: TrashDataItem;
}
