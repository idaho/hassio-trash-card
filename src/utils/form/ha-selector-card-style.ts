import { fireEvent } from 'lovelace-mushroom/src/ha';
import { customElement, property } from 'lit/decorators.js';
import { html, LitElement } from 'lit';

import type { HomeAssistant } from '../ha';
import './card-style';

export interface TrashCardCardStyleSelector {
  // eslint-disable-next-line @typescript-eslint/ban-types
  trashcard_cardstyle: {};
}

@customElement('ha-selector-trashcard_cardstyle')
export class HaTrashCardCardStyleSelector extends LitElement {
  @property() public hass!: HomeAssistant;

  @property() public selector!: TrashCardCardStyleSelector;

  @property() public value?: string;

  @property() public label?: string;

  protected render () {
    /* eslint-disable @typescript-eslint/unbound-method */
    return html`
            <trash-card-cardstyle-selector
                .hass=${this.hass}
                .label=${this.label}
                .value=${this.value}
                @value-changed=${this.valueChanged}
            ></trash-card-cardstyle-selector>
        `;
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  private valueChanged (ev: CustomEvent) {
    fireEvent(this, 'value-changed', { value: ev.detail.value || undefined });
  }
}
