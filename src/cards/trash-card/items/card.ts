import { computeRTL } from 'lovelace-mushroom/src/ha';
import { css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';
import { getColoredStyle } from '../../../utils/getColoredStyle';
import { BaseItemElement } from './BaseItemElement';

@customElement(`${TRASH_CARD_NAME}-item-card`)
class ItemCard extends BaseItemElement {
  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const rtl = computeRTL(this.hass);

    const { color_mode, hide_time_range, day_style, layout, with_label } = this.config;

    const { label } = item;

    const style = {
      ...getColoredStyle(color_mode, item)
    };

    const secondary = getDateString(item, hide_time_range ?? false, day_style, this.hass);

    const pictureUrl = this.getPictureUrl();

    this.withBackground = true;

    return html`
      <ha-card style=${styleMap(style)}>
        <mushroom-card .appearance=${{ layout }} ?rtl=${rtl}>
          <mushroom-state-item .appearance=${{ layout }} ?rtl=${rtl}>
            <div slot="icon">
              ${pictureUrl ? this.renderPicture(pictureUrl) : this.renderIcon()}
            </div>
            <mushroom-state-info
              slot="info"
              .primary=${with_label ? label : secondary}
              .secondary=${with_label ? secondary : undefined}
              .multiline_secondary=${true}
            ></mushroom-state-info>
          </mushroom-state-item>
        </mushroom-card>
      </ha-card>
    `;
  }

  public static get styles () {
    return [
      defaultHaCardStyle,
      ...BaseItemElement.styles,
      css`
        ha-card {
          justify-content: space-between;
          height: 100%;
          --mdc-icon-size: var(--trash-card-icon-size, 24px);
          background: var(--trash-card-background, 
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
  ItemCard
};
