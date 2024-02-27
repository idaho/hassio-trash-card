import { computeRTL } from 'lovelace-mushroom/src/ha';
import { LitElement, css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';
import { getColoredStyle } from '../../../utils/getColoredStyle';

import '../elements/icon';

import type { CardStyleConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

@customElement(`${TRASH_CARD_NAME}-item-card`)
class ItemCard extends LitElement {
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

    const { color_mode, hide_time_range, day_style, layout } = this.config;

    const { label } = item;

    const style = {
      ...getColoredStyle(color_mode, item)
    };

    const secondary = getDateString(item, hide_time_range ?? false, day_style, this.hass);

    return html`
      <ha-card style=${styleMap(style)}>
        <mushroom-card .appearance=${{ layout }} ?rtl=${rtl}>
          <mushroom-state-item .appearance=${{ layout }} ?rtl=${rtl}>
            <trash-card-element-icon
              .hass=${this.hass}
              .config=${this.config}
              .item=${item}
              slot="icon"
            ></trash-card-element-icon>
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

  public static get styles () {
    return [
      defaultHaCardStyle,
      css`
        ha-card {
          justify-content: space-between;
          height: 100%;
          background: var(--trash-card-background, 
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
  ItemCard
};
