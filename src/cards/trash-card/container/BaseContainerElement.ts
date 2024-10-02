/* eslint-disable unicorn/filename-case */

import type { HomeAssistant } from '../../../utils/ha';
import type { TrashCardConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';

interface BaseContainerElement extends HTMLElement {
  setConfig: (config?: TrashCardConfig) => void;

  setItems: (items?: CalendarItem[]) => void;

  setHass: (hass?: HomeAssistant) => void;
}

export {
  BaseContainerElement
};
