import { computeRTL } from 'lovelace-mushroom/src/ha';
import { LitElement, html, nothing } from 'lit';
import { computeAppearance } from 'lovelace-mushroom/src/utils/appearance';
import { computeRgbColor } from 'lovelace-mushroom/src/utils/colors';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';

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

    const appearance = computeAppearance({ layout: this.config.layout });

    const rtl = computeRTL(this.hass);

    const { label } = item;
    const color = item.color ?? 'disabled';

    const backgroundStyle = {};

    if (this.config.color_mode !== 'icon' && color !== 'disabled') {
      const rgbColor = computeRgbColor(color);

      backgroundStyle['background-color'] = `rgba(${rgbColor}, 0.5)`;
    }

    const secondary = getDateString(item, this.config.hide_time_range ?? false, this.config.day_style, this.hass);

    const cssClassMap = classMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fill-container': appearance.fill_container
    });

    return html`
      <ha-card class=${cssClassMap} style=${styleMap(backgroundStyle)}>
        <mushroom-card .appearance=${appearance} ?rtl=${rtl}>
          <mushroom-state-item
              ?rtl=${rtl}
              .appearance=${appearance}
          >
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
      defaultHaCardStyle
    ];
  }
}

export {
  ItemCard
};
