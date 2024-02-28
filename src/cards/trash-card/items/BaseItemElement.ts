/* eslint-disable unicorn/filename-case */
import { LitElement, html } from 'lit';
import { getPicture } from '../../../utils/getPicture';
import { state } from 'lit/decorators.js';

import type { CardStyleConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

// eslint-disable-next-line @typescript-eslint/ban-types
class BaseItemElement<T = {}> extends LitElement {
  @state() protected readonly item?: CalendarItem & T;

  @state() protected readonly hass?: HomeAssistant;

  @state() protected readonly config?: CardStyleConfig;

  protected getPictureUrl () {
    return getPicture(this.item!.picture, this.hass!);
  }

  protected renderPicture (pictureUrl: string) {
    return html`
      <trash-card-element-picture
        .hass=${this.hass}
        .config=${this.config}
        .pictureUrl=${pictureUrl}
      ></trash-card-element-icon>`;
  }

  protected renderIcon () {
    return html`
      <trash-card-element-icon
        .hass=${this.hass}
        .config=${this.config}
        .item=${this.item}
      ></trash-card-element-icon>`;
  }
}

export {
  BaseItemElement
};
