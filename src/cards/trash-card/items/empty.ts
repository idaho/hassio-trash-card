import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { BaseItemElement } from './BaseItemElement';
import setupCustomlocalize from '../../../localize';

@customElement(`${TRASH_CARD_NAME}-item-empty`)
class ItemCard extends BaseItemElement {
  public render () {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const customLocalize = setupCustomlocalize(this.hass);

    if (this.config.entities.length === 0) {
      return html`
      <ha-alert alert-type="error" .title="TrashCard">
        <b>${customLocalize('card.not_found.title')}</b>
        <div>${customLocalize('card.not_found.description')}</div>
      </ha-alert>
    `;
    }

    return html`
      <ha-alert alert-type="warning" .title="TrashCard">
        <div><b>TrashCard</b></div>
        <div>${customLocalize('card.empty.description')}</div>
      </hui-warning>
    `;
  }
}

export {
  ItemCard
};
