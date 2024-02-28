import { computeRTL } from 'lovelace-mushroom/src/ha';
import { css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { getColoredStyle } from '../../../utils/getColoredStyle';
import { BaseItemElement } from './BaseItemElement';

import '../elements/icon';

@customElement(`${TRASH_CARD_NAME}-item-chip`)
class ItemChip extends BaseItemElement {
  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const rtl = computeRTL(this.hass);

    const { color_mode, hide_time_range, day_style } = this.config;

    const style = {
      ...getColoredStyle(color_mode, item)
    };

    const content = getDateString(item, hide_time_range ?? false, day_style, this.hass);

    const pictureUrl = this.getPictureUrl();

    return html`
      <mushroom-chip
        style=${styleMap(style)}
        ?rtl=${rtl}
        .avatarOnly=${false}
      >
        ${pictureUrl ? this.renderPicture(pictureUrl) : this.renderIcon()}
        ${content ? html`<span>${content}</span>` : nothing}
      </mushroom-chip>`;
  }

  public static get styles () {
    return [
      css`
        mushroom-chip {
          --mdc-icon-size: var(--trash-card-icon-size, 16px);
          --chip-background: var(--trash-card-background, 
              var(--ha-card-background, 
                var(--card-background-color, #fff)
              )
            );
        } 
      `
    ];
  }
}

export {
  ItemChip
};
