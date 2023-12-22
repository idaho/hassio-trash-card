/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-return-assign */
import { animations } from 'lovelace-mushroom/src/utils/entity-styles';
import { assert } from 'superstruct';
import { GENERIC_LABELS } from 'lovelace-mushroom/src/utils/form/generic-fields';
import type { HaFormSchema } from '../../utils/form/ha-form';
import type { ItemSettings } from '../../utils/itemSettings';
import { loadHaComponents } from 'lovelace-mushroom/src/utils/loader';
import setupCustomlocalize from '../../localize';
import { TRASH_CARD_EDITOR_NAME } from './const';

import { css, type CSSResultGroup, html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { defaultColorCss, defaultDarkColorCss } from 'lovelace-mushroom/src/utils/colors';
import { entityCardConfigStruct, type TrashCardConfig } from './trash-card-config';
import { fireEvent, type HASSDomEvent, type HomeAssistant, type LovelaceCardEditor } from 'lovelace-mushroom/src/ha';
import { SCHEMA_APPEARANCE, SCHEMA_ENTITY, SCHEMA_PATTERN, SCHEMA_PATTERN_OTHERS, SCHEMA_SETTINGS } from './formSchemas';
import { themeColorCss, themeVariables } from 'lovelace-mushroom/src/utils/theme';
import './trash-card-pattern-editor';

interface MwcTabBarEvent extends Event {
  detail: {
    index: number;
  };
}

export interface SubElementEditorConfig {
  index?: number;
  key?: string;
  elementConfig?: ItemSettings;
  type: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const TRASH_LABELS = new Set([
  'label',
  'icon',
  'color',
  'pattern'
]);

// eslint-disable-next-line @typescript-eslint/naming-convention
const OTHER_LABELS = new Set([
  'next_days',
  'filter_events',
  'full_size',
  'drop_todayevents_from',
  'use_summary',
  'day_style'
]);

export const computeDarkMode = (hass?: HomeAssistant): boolean => {
  if (!hass) {
    return false;
  }

  return (hass.themes as any).darkMode as boolean;
};

@customElement(TRASH_CARD_EDITOR_NAME)
export class TrashCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @state() private config?: TrashCardConfig;

  @property() private selectedTabIndex = 0;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @state() private subElementEditorConfig?: SubElementEditorConfig;

  public connectedCallback (): void {
    super.connectedCallback();
    // eslint-disable-next-line no-void
    void loadHaComponents();
  }

  public setConfig (config: Partial<TrashCardConfig>): void {
    assert(config, entityCardConfigStruct);

    this.config = {
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

    if (GENERIC_LABELS.includes(schema.name) || OTHER_LABELS.has(schema.name)) {
      return customLocalize(`editor.card.generic.${schema.name}`);
    }
    if (schema.label && TRASH_LABELS.has(schema.label)) {
      return customLocalize(`editor.card.trash.pattern.fields.${schema.label}`);
    }

    return this.hass.localize(`ui.panel.lovelace.editor.card.generic.${schema.name}`);
  };

  private editDetailElement (ev: HASSDomEvent<{ subElementConfig: SubElementEditorConfig }>): void {
    this.subElementEditorConfig = ev.detail.subElementConfig;
  }

  private renderFormAppearance () {
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${SCHEMA_APPEARANCE}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.valueChanged}
      ></ha-form>`;
  }

  private renderFormPatternsEditor () {
    if (!this.hass) {
      return nothing;
    }

    const customLocalize = setupCustomlocalize(this.hass);

    if (this.subElementEditorConfig) {
      return html`
        <div class="header">
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
              .data=${this.subElementEditorConfig.elementConfig}
              .schema=${this.subElementEditorConfig.key === 'others' ? SCHEMA_PATTERN_OTHERS : SCHEMA_PATTERN}
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

  private renderFormSettings () {
    return html`
    <ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${SCHEMA_SETTINGS}
      .computeLabel=${this.computeLabel}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
  }

  private goBack (): void {
    this.subElementEditorConfig = undefined;
  }

  private handleSubElementChanged (ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config || !this.hass) {
      return;
    }

    const item = this.subElementEditorConfig!.key!;

    const { value } = ev.detail;

    this.config.settings = {
      ...this.config.settings,
      [item]: {
        ...this.config.settings![item] ?? {},
        ...value
      }
    };

    this.subElementEditorConfig = {
      ...this.subElementEditorConfig!,
      elementConfig: value
    };

    // @ts-expect-error 2345
    fireEvent(this, 'config-changed', { config: this.config });
  }

  protected render () {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const customLocalize = setupCustomlocalize(this.hass);

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${SCHEMA_ENTITY}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.valueChanged}
      ></ha-form>
      <mwc-tab-bar
        style="padding-top:15px;"
        @MDCTabBar:activated=${(ev: MwcTabBarEvent) => (this.selectedTabIndex = ev.detail.index)}
        activeIndex="0"
      >
        <mwc-tab label=${customLocalize('editor.form.tabs.settings')} ></mwc-tab>
        <mwc-tab label=${customLocalize('editor.form.tabs.appearance')} ></mwc-tab>
        <mwc-tab label=${customLocalize('editor.form.tabs.patterns')} ></mwc-tab>
      </mwc-tab-bar>
      <section>
        <article style="padding-top:10px">
          ${this.selectedTabIndex === 0 ? this.renderFormSettings() : nothing}
          ${this.selectedTabIndex === 1 ? this.renderFormAppearance() : nothing}
          ${this.selectedTabIndex === 2 ? this.renderFormPatternsEditor() : nothing}
        </article>
      </section/>
    `;
  }

  protected valueChanged (ev: CustomEvent): void {
    // @ts-expect-error 2345
    fireEvent(this, 'config-changed', { config: ev.detail.value });
  }

  public static get styles (): CSSResultGroup {
    return [
      animations,
      css`
        :host {
            ${defaultColorCss}
        }
        :host([dark-mode]) {
            ${defaultDarkColorCss}
        }
        :host {
            ${themeColorCss}
            ${themeVariables}
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .back-title {
            display: flex;
            align-items: center;
            font-size: 18px;
        }
        ha-icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }
      `
    ];
  }
}
