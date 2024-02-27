import { computeRTL } from 'lovelace-mushroom/src/ha';
import { LitElement, css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { getColoredStyle } from '../../../utils/getColoredStyle';

import '../elements/icon';

import type { CardStyleConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

@customElement(`${TRASH_CARD_NAME}-item-chip`)
class ItemChip extends LitElement {
  @state() private readonly item?: CalendarItem;

  @state() private readonly hass?: HomeAssistant;

  @state() private readonly config?: CardStyleConfig;

  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const rtl = computeRTL(this.hass);

    const { color_mode, hide_time_range, day_style } = this.config;

    const style = {
      ...getColoredStyle(color_mode, item)
    };

    const content = getDateString(item, hide_time_range ?? false, day_style, this.hass);

    return html`
      <mushroom-chip
        style=${styleMap(style)}
        ?rtl=${rtl}
        .avatarOnly=${false}
      >
        <trash-card-element-icon
        .hass=${this.hass}
        .config=${this.config}
        .item=${item}
        ></trash-card-element-icon>
        ${content ? html`<span>${content}</span>` : nothing}
      </mushroom-chip>`;
  }

  public static get styles () {
    return [
      css`
        mushroom-chip {
          --chip-background: var(--trash-card-background, 
              var(--ha-card-background, 
                var(--card-background-color, #fff)
              )
            );
        } 
      `
    ];
  }
}

export {
  ItemChip
};
