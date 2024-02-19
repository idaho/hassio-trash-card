import { Base } from './base';
import { computeRTL } from 'lovelace-mushroom/src/ha';
import { css, html, nothing } from 'lit';
import { computeAppearance } from 'lovelace-mushroom/src/utils/appearance';
import { computeRgbColor } from 'lovelace-mushroom/src/utils/colors';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';

import type { CalendarItem } from '../../../utils/calendarItem';
import type { HassEntity } from 'home-assistant-js-websocket';

class Chip extends Base {
  public renderItems (items?: CalendarItem[]) {
    if (!this.config || !this.hass || !this.config.entity) {
      return nothing;
    }

    const entityId = this.config.entity;
    const stateObj = this.hass.states[entityId] as HassEntity | undefined;

    if (!stateObj || !items || items.length === 0) {
      return nothing;
    }

    const itemsPerRow = this.config.items_per_row ?? 1;

    const cssStyleMap = styleMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'grid-template-columns': `repeat(${itemsPerRow}, calc(calc(100% - ${(itemsPerRow - 1) * 5}px) / ${itemsPerRow}))`
    });

    return html`
        <div style=${cssStyleMap} class="chip-container">
          ${items.map(item => this.renderItem(item))}
        </div>
      `;
  }

  public renderItem (item: CalendarItem) {
    if (!this.config || !this.hass || !this.config.entity) {
      return nothing;
    }

    const entityId = this.config.entity;
    const stateObj = this.hass.states[entityId] as HassEntity | undefined;

    if (!stateObj) {
      return nothing;
    }

    const appearance = computeAppearance(this.config);

    const rtl = computeRTL(this.hass);

    const { label } = item;
    const color = item.color ?? 'disabled';

    const backgroundStyle = {};

    if (color !== 'disabled') {
      const rgbColor = computeRgbColor(color);

      backgroundStyle['--chip-background'] = `rgba(${rgbColor}, 0.5)`;
    }

    const content = getDateString(item, this.config.hide_time_range ?? false, this.config, this.hass);

    return html`
      <mushroom-chip
        style=${styleMap(backgroundStyle)}
        ?rtl=${rtl}
        .avatar=${undefined}
        .avatarOnly=${false}
    >
        ${this.renderIcon(item)}
        <span>${content}</span>
    </mushroom-chip>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderIcon (item: CalendarItem) {
    const icon = item.icon ?? 'mdi:delete-outline';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const iconColor = item.color ?? 'disabled';

    const iconStyle = {};

    // `rgba(${rgbColor}, 1)`
    iconStyle['--icon-color'] = `rgba(var(--white-color), 0.5)`;

    return html`<ha-state-icon
        .hass=${this.hass}
        .icon=${icon}
        style=${styleMap(iconStyle)}
      ></ha-state-icon>`;
  }

  public static getStyles () {
    return [
      css`
        .chip-container ha-card {
          background: none;
          box-shadow: none;
          border-radius: 0;
          border: none;
        }
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
        
        mushroom-chip {
          cursor: pointer;
        }
        .chip-container mushroom-chip ha-state-icon {
            color: var(--icon-color);
            margin-bottom: 0px;
        }
        .chip-container mushroom-chip span {
            margin-bottom: 0px;
        }
      `
    ];
  }
}

export {
  Chip
};
