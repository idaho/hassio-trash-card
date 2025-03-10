import { css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';
import { getColoredStyle } from '../../../utils/getColoredStyle';
import { BaseItemElement } from './BaseItemElement';
import { daysTill } from '../../../utils/daysTill';
import { classMap } from 'lit/directives/class-map.js';

@customElement(`${TRASH_CARD_NAME}-item-card`)
class ItemCard extends BaseItemElement {
  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const { color_mode, hide_time_range, day_style, layout, with_label, day_style_format } = this.config;

    const { label, date } = item;

    const style = {
      ...getColoredStyle(color_mode, item, this.parentElement, this.hass.themes.darkMode)
    };

    const content = getDateString(item, hide_time_range ?? false, day_style, day_style_format, this.hass);

    const daysTillToday = Math.abs(daysTill(new Date(), date.start));

    const cssClasses = {
      today: daysTillToday === 0,
      tomorrow: daysTillToday === 1,
      another: daysTillToday > 1
    };

    const pictureUrl = this.getPictureUrl();

    const contentClasses = { vertical: layout === 'vertical' };

    return html`
      <ha-card style=${styleMap(style)} class=${classMap(cssClasses)}>
        <div class="background" aria-labelledby="info" ></div>
        <div class="container">
          <div class="content ${classMap(contentClasses)}" >
            <div class="icon-container">
              ${pictureUrl ? this.renderPicture(pictureUrl) : this.renderIcon()}
            </div>
            <ha-tile-info
              id="info"
              .primary=${with_label ? label : content}
              .secondary=${with_label ? content : undefined}
              .multiline=${true}
            ></ha-tile-info>
          </div>
        </div>
      </ha-card>
    `;
  }

  public static get styles () {
    return [
      defaultHaCardStyle,
      css`

        :host {
          -webkit-tap-highlight-color: transparent;
        }

        ha-card {
          --ha-ripple-color: var(--tile-color);
          --ha-ripple-hover-opacity: 0.04;
          --ha-ripple-pressed-opacity: 0.12;
          height: 100%;
          transition:
            box-shadow 180ms ease-in-out,
            border-color 180ms ease-in-out;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .background {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          border-radius: var(--ha-card-border-radius, 12px);
          margin: calc(-1 * var(--ha-card-border-width, 1px));
          overflow: hidden;
        }
        .container {
          margin: calc(-1 * var(--ha-card-border-width, 1px));
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .content {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 10px;
          flex: 1;
          box-sizing: border-box;
          pointer-events: none;
        }
        .vertical {
          flex-direction: column;
          text-align: center;
          justify-content: center;
        }
        .vertical .icon-container {
          margin-bottom: 10px;
          margin-right: 0;
          margin-inline-start: initial;
          margin-inline-end: initial;
        }
        .vertical ha-tile-info {
          width: 100%;
          flex: none;
        }
        .icon-container {
          position: relative;
          flex: none;
          margin-right: 10px;
          margin-inline-start: initial;
          margin-inline-end: 10px;
          direction: var(--direction);
          transition: transform 180ms ease-in-out;
        }
        .icon-container ha-tile-icon,
        .icon-container hui-image {
          --tile-icon-color: var(--tile-color);
          user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
        }
        .icon-container hui-image {
          width: 24px;
          height: 24px
        }
        .icon-container hui-image img {
          object-fit: cover;
        }
        .icon-container ha-tile-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          inset-inline-end: -3px;
          inset-inline-start: initial;
        }
        ha-tile-info {
          position: relative;
          min-width: 0;
          transition: background-color 180ms ease-in-out;
          box-sizing: border-box;
        }
        .icon-container ha-tile-icon ha-state-icon {
          --tile-icon-color: var(--icon-color);
        }

    
      `
    ];
  }
}

export {
  ItemCard
};
