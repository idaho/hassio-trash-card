import { LitElement, css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

import '../items/card';

import type { BaseContainerElement } from './BaseContainerElement';
import type { TrashCardConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

@customElement(`${TRASH_CARD_NAME}-cards-container`)
class Cards extends LitElement implements BaseContainerElement {
  @state() private items?: CalendarItem[];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: TrashCardConfig;

  public setConfig (config?: TrashCardConfig) {
    this.config = config;
  }

  public setItems (items?: CalendarItem[]) {
    this.items = items;
  }

  public setHass (hass?: HomeAssistant) {
    this.hass = hass;
  }

  public render () {
    if (!this.config || !this.hass) {
      return nothing;
    }

    if (!this.items || this.items.length === 0) {
      return nothing;
    }

    const itemsPerRow = this.config.items_per_row ?? 1;

    const cssStyleMap = styleMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'grid-template-columns': `repeat(${itemsPerRow}, calc(calc(100% - calc(${itemsPerRow - 1} * var(--grid-card-gap, 2px))) / ${itemsPerRow}))`
    });

    return html`
        <div style=${cssStyleMap} class="card-container">
          ${this.items.map(item => html`
              <trash-card-item-card
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
      css`
        .card-container {
          display: grid;
          grid-auto-rows: 1fr;
          grid-gap: var(--grid-card-gap, 2px);
        }
        trash-card-item-card {
          grid-row: auto / span 1;
        }
      `
    ];
  }
}

export {
  Cards
};
