/* eslint-disable unicorn/filename-case */
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { getPicture } from '../../../utils/getPicture';

import type { TrashCardConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

// eslint-disable-next-line @typescript-eslint/ban-types
class BaseItemElement<T = {}> extends LitElement {
  @state() protected readonly item?: CalendarItem & T;

  @state() protected readonly hass?: HomeAssistant;

  @state() protected readonly config?: TrashCardConfig;

  protected withBackground = false;

  protected getPictureUrl () {
    return getPicture(this.item!.picture, this.hass!);
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderPicture (pictureUrl: string) {
    return html`
    <hui-image
      .image=${pictureUrl}
      .hass=${this.hass}

    ></hui-image>`;
  }

  protected renderIcon () {
    return html`
      <ha-tile-icon>
        <ha-state-icon
          slot="icon"
          .icon=${this.item?.icon}
          .hass=${this.hass}
        ></ha-state-icon>
      </ha-tile-icon>`;
  }
}

export {
  BaseItemElement
};
