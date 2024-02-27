import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

import type { HomeAssistant } from '../../../utils/ha';
import type { CardStyleConfig } from '../trash-card-config';
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

    return html`<ha-state-icon
        .hass=${this.hass}
        .icon=${icon}
        slot=${this.slot ? this.slot : undefined}
      ></ha-state-icon>`;
  }

  public static get styles () {
    return [
      css`
        ha-state-icon {
          color: var(--trash-card-icon-color);
        }
      `
    ];
  }
}

export {
  ItemCard
};
