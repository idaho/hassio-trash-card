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

    const style = {
      ...getColoredStyle([ 'icon', 'badge' ], item, this.parentElement, this.hass.themes.darkMode),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--mdc-icon-size': `${this.config.icon_size ?? 40}px`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--trash-card-icon-size': `${this.config.icon_size ?? 40}px`
    };

    const daysTillToday = Math.abs(daysTill(new Date(), item.date.start));

    const cssClasses = {
      today: daysTillToday === 0,
      tomorrow: daysTillToday === 1,
      another: daysTillToday > 1,
      nextEvent: this.item.nextEvent,
      futureEvent: !this.item.nextEvent
    };

    const pictureUrl = this.getPictureUrl();

    this.withBackground = true;

    return html`
      <ha-card style=${styleMap(style)} class=${classMap(cssClasses)}>
          <div class="container">
          <div class="content">
          <div class="icon-container">
          ${pictureUrl ?
    this.renderPicture(pictureUrl) :
    html`<ha-icon .icon=${this.item.icon} .hass=${this.hass}></ha-icon>`
}
              </div>
          </div>
        </div>
        <span class="badge" >${daysTillToday}</span>
      </ha-card>
    `;
  }

  public static get styles () {
    return [
      defaultHaCardStyle,
      css`
        :host {
          --ha-card-border-width: 0px;
          --ha-card-background: transparent;
        }
        ha-card {
          display: grid;
        }
        .content {
          justify-content: space-around;
          display: flex;
        }
        .icon-container {
          margin-bottom: 5px;
          display: block;
        }
        .badge {
          display: inline-grid;
          border-radius: 15px;
          background-color: var(--badge-color);
          color: var(--primary-text-color);
          overflow: hidden;
          font-size: 80%;
          text-align: center;
          width: fit-content;
          padding: 0 1em;
          justify-self: center;
          border: none;
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
