/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-return-assign */
import { guard } from 'lit/directives/guard.js';
import setupCustomlocalize from '../../localize';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent } from '../../utils/fireEvent';

import type { TrashCardConfig } from './trash-card-config';
import type { CSSResultGroup, PropertyValues } from 'lit';
import type { ItemSettings } from '../../utils/itemSettings';
import type { HomeAssistant } from '../../utils/ha';

interface SubElementEditorConfig {
  index?: number;
  key?: string;
  elementConfig?: ItemSettings;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface HASSDomEvents {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'edit-pattern-item': {
      subElementConfig: SubElementEditorConfig;
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'delete-pattern-item': {
      index: number;
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'create-pattern-item': {
      index: number;
    };
  }
}

@customElement(`trash-card-pattern-editor`)
class TrashCardPatternEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() protected pattern?: TrashCardConfig['pattern'];

  @state() private attached = false;

  public connectedCallback () {
    super.connectedCallback();
    this.attached = true;
  }

  public disconnectedCallback () {
    super.disconnectedCallback();
    this.attached = false;
  }

  protected updated (changedProps: PropertyValues): void {
    super.updated(changedProps);

    const attachedChanged = changedProps.has('attached');
    const patternChanged = changedProps.has('pattern');

    if (!patternChanged && !attachedChanged) {
      return;
    }

    if (patternChanged) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleSettingsChanged();
    }
  }

  private async handleSettingsChanged () {
    await this.updateComplete;
  }

  protected render () {
    if (!this.hass || !this.pattern) {
      return nothing;
    }

    const customLocalize = setupCustomlocalize(this.hass);

    return html`
      <div class="settings">
      ${guard([ this.pattern ],
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    () => this.pattern!.map((settingsConfig, index) =>
      html`
          <div class="setting">
            <div class="icon">
              <ha-icon icon="${settingsConfig.icon}"></ha-icon>
            </div>

            <div class="special-row">
              <div>
                <span> ${settingsConfig.label ?? customLocalize(`editor.card.trash.pattern.type.${settingsConfig.type}`)}</span>
              </div>
            </div>

            <ha-icon-button
              .label=${customLocalize('editor.card.trash.pattern.edit')}
              class="edit-icon"
              .index=${index}
              @click=${this.editItem}
              >
              <ha-icon icon="mdi:pencil"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${customLocalize('editor.card.trash.pattern.delete')}
              class="delete-icon"
              .index=${index}
              .disabled=${settingsConfig.type !== 'custom'}
              @click=${this.deleteItem}
              >
              <ha-icon icon="mdi:close"></ha-icon>
            </ha-icon-button>
          </div>`))}

        <mwc-button
          @click=${this.createItem}
          class="gui-mode-button"
        >${customLocalize('editor.card.trash.pattern.create')}</mwc-button>
    </div>`;
  }

  private editItem (ev: CustomEvent): void {
    const { index } = (ev.currentTarget as any);

    fireEvent(this, 'edit-pattern-item', {
      subElementConfig: {
        index,
        key: index,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        elementConfig: this.pattern![index]
      }
    });
  }

  private deleteItem (ev: CustomEvent): void {
    const { index } = (ev.currentTarget as any);

    fireEvent(this, 'delete-pattern-item', {
      index
    });
  }

  private createItem (ev: CustomEvent): void {
    const { index } = (ev.currentTarget as any);

    fireEvent(this, 'create-pattern-item', {
      index
    });
  }

  public static get styles (): CSSResultGroup {
    return [
      css`
        .settings {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: var(--spacing);
        }

        .setting {
            display: flex;
            align-items: center;
        }

        ha-icon {
            display: flex;
        }

        .setting .icon {
            padding-right: 8px;
            cursor: move;
        }

        .setting .icon > * {
            pointer-events: none;
        }

        .special-row {
            height: 60px;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-grow: 1;
        }

        .special-row div {
            display: flex;
            flex-direction: column;
        }

        .remove-icon,
        .edit-icon {
            --mdc-icon-button-size: 36px;
            color: var(--secondary-text-color);
        }

        .secondary {
            font-size: 12px;
            color: var(--secondary-text-color);
        }
        `
    ];
  }
}

export {
  TrashCardPatternEditor
};

export type {
  SubElementEditorConfig
};
