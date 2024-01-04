import { fireEvent } from 'lovelace-mushroom/src/ha';
import { type HomeAssistant } from '../ha';
import { customElement, property } from 'lit/decorators.js';
import { html, LitElement } from 'lit';
import './date-style';

export interface TrashCardDateStyleSelector {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/ban-types
  trashcard_datestyle: {};
}

@customElement('ha-selector-trashcard_datestyle')
export class HaTrashCardDateStyleSelector extends LitElement {
  @property() public hass!: HomeAssistant;

  @property() public selector!: TrashCardDateStyleSelector;

  @property() public value?: string;

  @property() public label?: string;

  protected render () {
    /* eslint-disable @typescript-eslint/unbound-method */
    return html`
            <trash-card-datestyle-selector
                .hass=${this.hass}
                .label=${this.label}
                .value=${this.value}
                @value-changed=${this.valueChanged}
            ></trash-card-datestyle-selector>
        `;
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  private valueChanged (ev: CustomEvent) {
    fireEvent(this, 'value-changed', { value: ev.detail.value || undefined });
  }
}
