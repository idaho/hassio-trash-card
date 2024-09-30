import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { getColoredStyle } from '../../../utils/getColoredStyle';
import { BaseItemElement } from './BaseItemElement';
import { classMap } from 'lit/directives/class-map.js';
import { daysTill } from '../../../utils/daysTill';

@customElement(`${TRASH_CARD_NAME}-item-chip`)
class ItemChip extends BaseItemElement {
  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const { color_mode, hide_time_range, day_style, day_style_format, with_label } = this.config;

    const style = {
      ...getColoredStyle(color_mode, item, this.hass.themes.darkMode)
    };

    const content = getDateString(item, hide_time_range ?? false, day_style, day_style_format, this.hass);

    const daysTillToday = daysTill(new Date(), item);

    const cssClasses = {
      today: daysTillToday === 0,
      tomorrow: daysTillToday === 1,
      another: daysTillToday > 1
    };

    const pictureUrl = this.getPictureUrl();

    this.withBackground = true;

    const badgeConfig = {
      ...this.config,
      show_name: true
    };

    return html`
      <ha-badge
        .type="badge"
        .hass=${this.hass}
        .config=${badgeConfig}
        style=${styleMap(style)}
        class=${classMap(cssClasses)}
        .iconOnly=${!with_label && !content}
        .label=${with_label ? item.label : nothing}
      >
        ${pictureUrl ?
    html`<img slot="icon" src=${pictureUrl} aria-hidden />` :
    html`<ha-state-icon
            slot="icon"
            .hass=${this.hass}
            .icon=${item.icon}
          ></ha-state-icon>`}
        ${content}
      </ha-badge>`;
  }
}

export {
  ItemChip
};
