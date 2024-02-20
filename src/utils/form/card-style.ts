import setupCustomlocalize from '../../localize';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { HomeAssistant } from '../ha';
import 'lovelace-mushroom/src/shared/form/mushroom-select';

@customElement('trash-card-cardstyle-selector')
export class TrashCardCardStyleSelector extends LitElement {
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
                .value=${this.value ?? 'card'}
                fixedMenuPosition
                naturalMenuWidth
            >
                <mwc-list-item value="card">
                  ${customLocalize('editor.form.card_style.values.card')}
                </mwc-list-item>
                <mwc-list-item value="chip">
                  ${customLocalize('editor.form.card_style.values.chip')}
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
