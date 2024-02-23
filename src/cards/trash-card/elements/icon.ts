import { LitElement, css, html, nothing } from 'lit';
import { computeRgbColor } from 'lovelace-mushroom/src/utils/colors';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { styleMap } from 'lit/directives/style-map.js';

import type { CardStyleConfig } from '../trash-card-config';
import type { HomeAssistant } from 'lovelace-mushroom/src/ha';
import type { CalendarItem } from '../../../utils/calendarItem';

@customElement(`${TRASH_CARD_NAME}-element-icon`)
class ItemCard extends LitElement {
  @state() private readonly item?: CalendarItem;

  @state() private readonly hass?: HomeAssistant;

  @state() private readonly config?: CardStyleConfig;

  public render () {
    if (!this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const icon = this.item.icon ?? 'mdi:delete-outline';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const iconColor = this.item.color ?? 'disabled';

    const iconStyle = {};

    if (this.config.color_mode === 'icon') {
      const rgbColor = computeRgbColor(iconColor);

      iconStyle['--icon-color'] = `rgba(${rgbColor}, 1)`;
    }

    return html`<ha-state-icon
        .hass=${this.hass}
        .icon=${icon}
        style=${styleMap(iconStyle)}
        slot=${this.slot ? this.slot : undefined}
      ></ha-state-icon>`;
  }

  public static get styles () {
    return [
      css`
        ha-state-icon {
          color: var(--icon-color);
        }
      `
    ];
  }
}

export {
  ItemCard
};
