import { computeRTL } from 'lovelace-mushroom/src/ha';
import { css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { getColoredStyle } from '../../../utils/getColoredStyle';
import { BaseItemElement } from './BaseItemElement';

@customElement(`${TRASH_CARD_NAME}-item-chip`)
class ItemChip extends BaseItemElement {
  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const rtl = computeRTL(this.hass);

    const { color_mode, hide_time_range, day_style, day_style_format, with_label } = this.config;

    const style = {
      ...getColoredStyle(color_mode, item),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ...with_label ? { '--chip-height': 'calc(36px * 1.15)' } : {}
    };

    const content = getDateString(item, hide_time_range ?? false, day_style, day_style_format, this.hass);

    const pictureUrl = this.getPictureUrl();

    this.withBackground = true;

    return html`
      <mushroom-chip
        style=${styleMap(style)}
        ?rtl=${rtl}
        .avatarOnly=${false}
      >
        ${pictureUrl ? this.renderPicture(pictureUrl) : this.renderIcon()}
        <span>
          ${with_label ? html`<span class="chip-label">${item.label}</span>` : nothing}
          ${content ? html`<span class="chip-content">${content}</span>` : nothing}
        </span>
      </mushroom-chip>`;
  }

  public static get styles () {
    return [
      ...BaseItemElement.styles,
      css`
        mushroom-chip {
          --mdc-icon-size: var(--trash-card-icon-size, 16px);
          --chip-background: var(--trash-card-background, 
              var(--ha-card-background, 
                var(--card-background-color, #fff)
              )
            );
          --chip-padding: 0.25em .5em 0.25em 0.25em;
          --chip-height: calc(36px * 1.15);
        } 
        mushroom-chip  ha-card {
          
        }
        .chip-label {
          font-weight: 600;
        }
        .chip-label + .chip-content {
          display: block;
          font-weight: 300;
          margin-top: 3px;
        }
      `
    ];
  }
}

export {
  ItemChip
};
