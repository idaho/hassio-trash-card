/* eslint-disable unicorn/filename-case */
import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { getPicture } from '../../../utils/getPicture';
import { classMap } from 'lit-html/directives/class-map.js';

import '../elements/icon';
import '../elements/picture';

import type { CardStyleConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

// eslint-disable-next-line @typescript-eslint/ban-types
class BaseItemElement<T = {}> extends LitElement {
  @state() protected readonly item?: CalendarItem & T;

  @state() protected readonly hass?: HomeAssistant;

  @state() protected readonly config?: CardStyleConfig;

  protected withBackground = false;

  protected getPictureUrl () {
    return getPicture(this.item!.picture, this.hass!);
  }

  protected getWithBackgroundClass () {
    return {
      withBackground: Boolean(this.withBackground)
    };
  }

  protected renderPicture (pictureUrl: string) {
    const cssClass = {
      ...this.getWithBackgroundClass()
    };

    return html`
      <trash-card-element-picture
        class=${classMap(cssClass)}
        .hass=${this.hass}
        .config=${this.config}
        .pictureUrl=${pictureUrl}
      ></trash-card-element-icon>`;
  }

  protected renderIcon () {
    const cssClass = {
      ...this.getWithBackgroundClass()
    };

    return html`
      <trash-card-element-icon
        class=${classMap(cssClass)}
        .background=${this.withBackground}
        .hass=${this.hass}
        .config=${this.config}
        .item=${this.item}
      ></trash-card-element-icon>`;
  }

  public static get styles () {
    return [
      css`
        .withBackground {
          display: grid;
          border-radius: 50%;
          justify-content: center;
          align-content: center;
          width: calc(var(--mdc-icon-size) *1.5);
          height: calc(var(--mdc-icon-size) *1.5);
          background-color: rgba(var(--rgb-disabled), 0.2);;
        }
      `
    ];
  }
}

export {
  BaseItemElement
};
