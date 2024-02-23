import { computeRTL } from 'lovelace-mushroom/src/ha';
import { LitElement, html, nothing } from 'lit';
import { computeRgbColor } from 'lovelace-mushroom/src/utils/colors';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

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

    const color = item.color ?? 'disabled';

    const backgroundStyle = {};

    if (this.config.color_mode !== 'icon' && color !== 'disabled') {
      const rgbColor = computeRgbColor(color);

      backgroundStyle['--chip-background'] = `rgba(${rgbColor}, 0.5)`;
    }

    const content = getDateString(item, this.config.hide_time_range ?? false, this.config.day_style, this.hass);

    return html`
      <mushroom-chip
        style=${styleMap(backgroundStyle)}
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
}

export {
  ItemChip
};
