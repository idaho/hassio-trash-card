import { computeRTL } from 'lovelace-mushroom/src/ha';
import { css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';
import { customElement } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';
import { getColoredStyle } from '../../../utils/getColoredStyle';
import { daysTill } from '../../../utils/daysTill';
import { BaseItemElement } from './BaseItemElement';

@customElement(`${TRASH_CARD_NAME}-icon-card`)
class IconCard extends BaseItemElement<{ nextEvent: boolean }> {
  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const rtl = computeRTL(this.hass);

    const style = {
      ...getColoredStyle([ 'icon', 'background' ], item),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--trash-card-icon-size': `${this.config.icon_size ?? 40}px`
    };

    const cssClass = {
      nextEvent: this.item.nextEvent,
      futureEvent: !this.item.nextEvent
    };

    const daysLeft = daysTill(new Date(), item);

    const pictureUrl = this.getPictureUrl();

    this.withBackground = true;

    return html`
      <ha-card style=${styleMap(style)} class=${classMap(cssClass)}>
        <mushroom-card .appearance=${{ layout: 'vertical' }} ?rtl=${rtl}>
          <mushroom-state-item .appearance=${{ layout: 'vertical' }} ?rtl=${rtl}>
            <div slot="icon">
              ${pictureUrl ? this.renderPicture(pictureUrl) : this.renderIcon()}
            </div>
          </mushroom-state-item>
        </mushroom-card>
        <span class="badge" >${daysLeft}</span>
      </ha-card>
    `;
  }

  public static get styles () {
    return [
      defaultHaCardStyle,
      ...BaseItemElement.styles,
      css`
        :host {
          --ha-card-border-width: 0px;
          --ha-card-background: transparent;
        }
        ha-card {
          height: 100%;
          grid-row: auto / span 1;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr auto;
          --mdc-icon-size: var(--trash-card-icon-size, 40px);
        }
        mushroom-card {
          align-self: center;
        }
        .badge {
          display: inline-grid;
          border-radius: 15px;
          background-color: var(--trash-card-background);
          color: var(--primary-text-color);
          overflow: hidden;
          font-size: 80%;
          text-align: center;
          width: fit-content;
          padding: 0 1em;
          justify-self: center;
          border-width: var(--trash-card-badge-border-width, 1px);
          border-color: var(--chip-border-color);
          border-style: solid;
          box-shadow: var(--chip-box-shadow);
          box-sizing: content-box;
        }
      `
    ];
  }
}

export {
  IconCard
};
