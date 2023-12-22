import type { HomeAssistant } from 'lovelace-mushroom/src/ha';
import setupCustomlocalize from '../../localize';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import 'lovelace-mushroom/src/shared/form/mushroom-select';

@customElement('trash-card-datestyle-selector')
export class TrashCardDateStyleSelector extends LitElement {
  @property() public label = '';

  @property() public value?: string;

  @property() public configValue = '';

  @property() public hass!: HomeAssistant;

  // eslint-disable-next-line  @typescript-eslint/naming-convention
  public selectChanged (ev) {
    const { value } = ev.target;

    if (value) {
      this.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: {
            value: value !== 'default' ? value : ''
          }
        })
      );
    }
  }

  public render () {
    const customLocalize = setupCustomlocalize(this.hass);

    /* eslint-disable @typescript-eslint/unbound-method */
    return html`
            <mushroom-select
                .label=${this.label}
                .configValue=${this.configValue}
                @selected=${this.selectChanged}
                @closed=${(evt: Event) => evt.stopPropagation()}
                .value=${this.value ?? 'default'}
                fixedMenuPosition
                naturalMenuWidth
            >
                <mwc-list-item value="default">
                  ${customLocalize('editor.form.day_style.values.default')}
                </mwc-list-item>
                <mwc-list-item value="counter">
                  ${customLocalize('editor.form.day_style.values.counter')}
                </mwc-list-item>
            </mushroom-select>
        `;
    /* eslint-enable  @typescript-eslint/unbound-method */
  }

  public static readonly styles = css`
            mushroom-select {
                width: 100%;
            }
        `;
}
