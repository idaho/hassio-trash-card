import { LitElement, css, html, nothing } from 'lit';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

import type { TrashCardConfig } from '../trash-card-config';
import type { HassEntity } from 'home-assistant-js-websocket';
import type { HomeAssistant } from 'lovelace-mushroom/src/ha';
import type { CalendarItem } from '../../../utils/calendarItem';

import '../items/chip';

@customElement(`${TRASH_CARD_NAME}-chips-container`)
class Chips extends LitElement {
  @state() private readonly items?: CalendarItem[];

  @state() private readonly hass?: HomeAssistant;

  @state() private readonly config?: TrashCardConfig;

  public render () {
    if (!this.config || !this.hass || !this.config.entity) {
      return nothing;
    }

    const entityId = this.config.entity;
    const stateObj = this.hass.states[entityId] as HassEntity | undefined;

    if (!stateObj || !this.items || this.items.length === 0) {
      return nothing;
    }

    return html`
    <div class="chip-container">
      ${this.items.map(item => html`
          <trash-card-item-chip
            .item=${item}
            .config=${this.config}
            .hass=${this.hass}
          >
          </trash-card-item-card>
        `)}
    </div>
  `;
  }

  public static get styles () {
    return [
      defaultHaCardStyle,
      css`
        .chip-container {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-bottom: calc(-1 * var(--chip-spacing));
        }
        .chip-container.align-end {
            justify-content: flex-end;
        }
        .chip-container.align-center {
            justify-content: center;
        }
        .chip-container.align-justify {
            justify-content: space-between;
        }
        .chip-container * {
            margin-bottom: var(--chip-spacing);
        }
        .chip-container *:not(:last-child) {
            margin-right: var(--chip-spacing);
        }
        .chip-container[rtl] *:not(:last-child) {
            margin-right: initial;
            margin-left: var(--chip-spacing);
        }
      `
    ];
  }
}

export {
  Chips
};
