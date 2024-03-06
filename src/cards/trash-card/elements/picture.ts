import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

import type { HomeAssistant } from '../../../utils/ha';
import type { CardStyleConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';

@customElement(`${TRASH_CARD_NAME}-element-picture`)
class Picture extends LitElement {
  @state() private readonly item?: CalendarItem;

  @state() private readonly hass?: HomeAssistant;

  @state() private readonly config?: CardStyleConfig;

  @state() private readonly pictureUrl?: string;

  public render () {
    if (!this.pictureUrl) {
      return nothing;
    }

    return html`<img
    src="${this.pictureUrl}" slot=${this.slot ? this.slot : undefined}/>`;
  }

  public static get styles () {
    return [
      css`
        img {
          height: var(--mdc-icon-size);
          width:  var(--mdc-icon-size);
          object-fit: contain;
        }
      `
    ];
  }
}

export {
  Picture
};
