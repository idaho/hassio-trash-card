import { Base } from './base';
import { actionHandler, computeRTL, hasAction } from 'lovelace-mushroom/src/ha';
import { css, html, nothing } from 'lit';
import { computeAppearance } from 'lovelace-mushroom/src/utils/appearance';
import { computeRgbColor } from 'lovelace-mushroom/src/utils/colors';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';

import type { CalendarItem } from '../../../utils/calendarItem';
import type { HassEntity } from 'home-assistant-js-websocket';

class Card extends Base {
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
        <div style=${cssStyleMap} class="card-container">
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

    if (this.config.color_mode !== 'icon' && color !== 'disabled') {
      const rgbColor = computeRgbColor(color);

      backgroundStyle['background-color'] = `rgba(${rgbColor}, 0.5)`;
    }

    const secondary = getDateString(item, this.config.hide_time_range ?? false, this.config, this.hass);

    const cssClassMap = classMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fill-container': appearance.fill_container,
      fullsize: this.config.full_size === true
    });

    return html`
      <ha-card class=${cssClassMap} style=${styleMap(backgroundStyle)}>
        <mushroom-card .appearance=${appearance} ?rtl=${rtl}>
            <mushroom-state-item
                ?rtl=${rtl}
                .appearance=${appearance}
                .actionHandler=${actionHandler({ hasHold: hasAction(this.config.hold_action), hasDoubleClick: hasAction(this.config.double_tap_action) })}
            >
                ${this.renderIcon(item)}
              <mushroom-state-info
                slot="info"
                .primary=${label}
                .secondary=${secondary}
                .multiline_secondary=${true}
              ></mushroom-state-info>
            </mushroom-state-item>
          </mushroom-card>
        </ha-card>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderIcon (item: CalendarItem) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const icon = item.icon ?? 'mdi:delete-outline';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const iconColor = item.color ?? 'disabled';

    const iconStyle = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--icon-color': `rgba(var(--white-color), 0.5)`
    };

    if (this.config?.color_mode === 'icon') {
      const rgbColor = computeRgbColor(iconColor);

      iconStyle['--icon-color'] = `rgba(${rgbColor}, 1)`;
    }

    return html`<ha-state-icon
        .hass=${this.hass}
        .icon=${icon}
        slot="icon"
        style=${styleMap(iconStyle)}
      ></ha-state-icon>`;
  }

  public static getStyles () {
    return [
      css`
        .card-container ha-state-icon {
            color: var(--icon-color);
        }
      `
    ];
  }
}

export {
  Card
};
