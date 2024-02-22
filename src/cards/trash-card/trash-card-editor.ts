/* eslint-disable @typescript-eslint/unbound-method */
import { assert } from 'superstruct';
import { computeDarkMode } from '../../utils/computeDarkMode';
import { GENERIC_LABELS } from 'lovelace-mushroom/src/utils/form/generic-fields';
import memoizeOne from 'memoize-one';
import setupCustomlocalize from '../../localize';
import { TRASH_CARD_EDITOR_NAME } from './const';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { entityCardConfigStruct } from './trash-card-config';
import { getPatternOthersSchema, getPatternSchema, getSchema } from './formSchemas';
import { fireEvent } from '../../utils/fireEvent';

import type { HASSDomEvent, LovelaceCardEditor } from 'lovelace-mushroom/src/ha';
import type { TrashCardConfig } from './trash-card-config';
import type { CSSResultGroup, PropertyValues } from 'lit';
import type { HomeAssistant } from '../../utils/ha';
import type { SubElementEditorConfig } from './trash-card-pattern-editor';
import type { HaFormSchema } from '../../utils/form/ha-form';

import './trash-card-pattern-editor';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface HASSDomEvents {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'config-changed': {
      config: TrashCardConfig;
    };
  }
}

const OTHER_LABELS = new Set([
  'next_days',
  'filter_events',
  'full_size',
  'drop_todayevents_from',
  'use_summary',
  'day_style',
  'card_style',
  'hide_time_range',
  'event_grouping'
]);

@customElement(TRASH_CARD_EDITOR_NAME)
class TrashCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @state() private config?: TrashCardConfig;

  @property() private readonly selectedTabIndex = 0;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @state() private subElementEditorConfig?: SubElementEditorConfig;

  @state() private readonly schema = memoizeOne(getSchema);

  public setConfig (config: Partial<TrashCardConfig>): void {
    assert(config, entityCardConfigStruct);

    this.config = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      event_grouping: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      drop_todayevents_from: '10:00:00',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      next_days: 2,
      settings: {
        organic: {
          icon: 'mdi:flower'
        },
        paper: {
          icon: 'mdi:newspaper'
        },
        recycle: {
          icon: 'mdi:recycle-variant'
        },
        waste: {
          icon: 'mdi:trash-can-outline'
        },
        others: {
          icon: 'mdi:dump-truck'
        },
        ...config.settings
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      day_style: 'default',
      card_style: 'card',
      color_mode: 'background',
      items_per_row: 1,
      refresh_rate: 60,
      ...config
    };
  }

  protected updated (changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass') && this.hass) {
      const currentDarkMode = computeDarkMode(changedProps.get('hass'));
      const newDarkMode = computeDarkMode(this.hass);

      if (currentDarkMode !== newDarkMode) {
        this.toggleAttribute('dark-mode', newDarkMode);
      }
    }
  }

  private readonly computeLabel = (schema: HaFormSchema) => {
    if (!this.hass) {
      return schema.name;
    }

    const customLocalize = setupCustomlocalize(this.hass);

    if (schema.label) {
      return schema.label;
    }

    if (GENERIC_LABELS.includes(schema.name) || OTHER_LABELS.has(schema.name)) {
      return customLocalize(`editor.card.generic.${schema.name}`);
    }

    if (schema.name === 'items_per_row') {
      return this.hass.localize('ui.panel.lovelace.editor.card.grid.columns');
    }
    if (schema.name === 'icon') {
      return this.hass.localize('ui.panel.lovelace.editor.card.generic.icon');
    }
    if (schema.name === 'color') {
      return this.hass.localize('ui.panel.lovelace.editor.card.tile.color');
    }

    return this.hass.localize(`ui.panel.lovelace.editor.card.generic.${schema.name}`);
  };

  // eslint-disable-next-line class-methods-use-this
  private readonly computeHelper = (schema: HaFormSchema) => {
    if (schema.helper) {
      return schema.helper;
    }

    return '';
  };

  private editDetailElement (ev: HASSDomEvent<{ subElementConfig: SubElementEditorConfig }>): void {
    this.subElementEditorConfig = ev.detail.subElementConfig;
  }

  private renderFormPatternsEditor () {
    if (!this.hass) {
      return nothing;
    }

    const customLocalize = setupCustomlocalize(this.hass);

    if (this.subElementEditorConfig) {
      const patternSchema = this.subElementEditorConfig.key === 'others' ?
        getPatternOthersSchema() :
        getPatternSchema(customLocalize);

      return html`
        <div class="header" id="trashcard-pattern-editor">
          <div class="back-title">
              <ha-icon-button
                  .label=${this.hass.localize('ui.common.back')}
                  @click=${this.goBack}
              >
                <ha-icon icon="mdi:arrow-left"></ha-icon>
              </ha-icon-button>
              <span slot="title">${customLocalize(`editor.card.trash.pattern.title`)}</span>
          </div>
        </div>
          <ha-form
              .hass=${this.hass}
              .computeLabel=${this.computeLabel}
              .computeHelper=${this.computeHelper}
              .data=${this.subElementEditorConfig.elementConfig}
              .schema=${patternSchema}
              @value-changed=${this.handleSubElementChanged}
          >
          </ha-form>
      `;
    }

    return html`
      <trash-card-pattern-editor
        .hass=${this.hass}
          .settings=${this.config!.settings}
          @settings-changed=${this.valueChanged}
          @edit-detail-element=${this.editDetailElement}
      ></trash-card-pattern-editor>`;
  }

  private goBack (): void {
    this.subElementEditorConfig = undefined;
  }

  private handleSubElementChanged (ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config || !this.hass || !this.subElementEditorConfig) {
      return;
    }

    const item = this.subElementEditorConfig.key!;

    const { value } = ev.detail;

    this.config.settings = {
      ...this.config.settings,
      [item]: {
        ...this.config.settings![item] ?? {},
        ...value
      }
    };

    this.subElementEditorConfig = {
      ...this.subElementEditorConfig,
      elementConfig: value
    };

    fireEvent(this, 'config-changed', { config: this.config });
  }

  protected render () {
    if (!this.hass || !this.config) {
      return nothing;
    }
    const customLocalize = setupCustomlocalize(this.hass);

    const schema = this.schema(customLocalize, this.config);

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${schema}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
      <ha-expansion-panel id="pattern-expansion-panel" outlined >
        <div slot="header" role="heading" aria-level="3" >
          <ha-icon icon="mdi:image-filter-center-focus">
          </ha-icon>
          ${customLocalize('editor.form.tabs.patterns')}
        </div>
        <div class="content">
          ${this.renderFormPatternsEditor()}
        </div>
      </ha-form-expandable>

    `;
  }

  protected valueChanged (ev: CustomEvent): void {
    const config = { ...ev.detail.value };

    if (config.color_mode === 'background') {
      delete config.color_mode;
    }

    if (config.day_style === 'default') {
      delete config.day_style;
    }

    if (config.card_style === 'card') {
      delete config.card_style;
    }

    fireEvent(this, 'config-changed', { config });
  }

  public static get styles (): CSSResultGroup {
    return [
      css`
      

        #trashcard-pattern-editor header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #trashcard-pattern-editor .back-title {
            display: flex;
            align-items: center;
            font-size: 18px;
        }

        #trashcard-pattern-editor ha-icon {
             display: flex;
             align-items: center;
             justify-content: center;
         }

        #pattern-expansion-panel {
          margin-top: 24px;
          display: flex !important;
          flex-direction: column;
        }
        #pattern-expansion-panel ha-form {
          display: block;
        }
        #pattern-expansion-panel .content {
          padding: 12px;
        }
        #pattern-expansion-panel {
          display: block;
          --expansion-panel-content-padding: 0;
          border-radius: 6px;
          --ha-card-border-radius: 6px;
        }
        #ha-expansion-panel ha-svg-icon,
        #ha-expansion-panel ha-icon {
          color: var(--secondary-text-color);
        }
      `
    ];
  }
}

export {
  TrashCardEditor
};
