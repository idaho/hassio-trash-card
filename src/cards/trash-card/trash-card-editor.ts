import { animations } from 'lovelace-mushroom/src/utils/entity-styles';
import { assert } from 'superstruct';
import { GENERIC_LABELS } from 'lovelace-mushroom/src/utils/form/generic-fields';
import type { HaFormSchema } from '../../utils/form/ha-form';
import { loadHaComponents } from 'lovelace-mushroom/src/utils/loader';
import setupCustomlocalize from '../../localize';
import { TRASH_CARD_EDITOR_NAME } from './const';

import { css, type CSSResultGroup, html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { defaultColorCss, defaultDarkColorCss } from 'lovelace-mushroom/src/utils/colors';
import { entityCardConfigStruct, type TrashCardConfig } from './trash-card-config';
import { fireEvent, type HomeAssistant, type LovelaceCardEditor } from 'lovelace-mushroom/src/ha';
import { themeColorCss, themeVariables } from 'lovelace-mushroom/src/utils/theme';

// eslint-disable-next-line @typescript-eslint/naming-convention
const TRASH_LABELS = new Set([
  'organic.label',
  'organic.icon',
  'organic.color',
  'organic.pattern',
  'paper.label',
  'paper.icon',
  'paper.color',
  'paper.pattern',
  'recycle.label',
  'recycle.icon',
  'recycle.color',
  'recycle.pattern',
  'waste.label',
  'waste.icon',
  'waste.color',
  'waste.pattern',
  'others.label',
  'others.icon',
  'others.color',
  'others.pattern'
]);

// eslint-disable-next-line @typescript-eslint/naming-convention
const OTHER_LABELS = new Set([
  'next_days'
]);

// eslint-disable-next-line @typescript-eslint/naming-convention
const SCHEMA: HaFormSchema[] = [
  { name: 'entity', selector: { entity: { domain: 'calendar' }}},
  {
    type: 'grid',
    name: 'settings',
    schema: [
      {
        type: 'grid',
        name: 'organic',
        label: 'Biomüll',
        schema: [
          { label: 'organic.label', name: 'label', selector: { text: {}}},
          {
            label: 'organic.icon',
            name: 'icon',
            selector: { icon: {}},
            // eslint-disable-next-line @typescript-eslint/naming-convention
            context: { icon_entity: 'entity' }
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { label: 'organic.color', name: 'color', selector: { mush_color: {}}},
          { label: 'organic.pattern', name: 'pattern', selector: { text: {}}}
        ]
      },
      {
        type: 'grid',
        name: 'paper',
        schema: [
          { label: 'paper.label', name: 'label', selector: { text: {}}},
          {
            label: 'paper.icon',
            name: 'icon',
            selector: { icon: {}},
            // eslint-disable-next-line @typescript-eslint/naming-convention
            context: { icon_entity: 'entity' }
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { label: 'paper.color', name: 'color', selector: { mush_color: {}}},
          { label: 'paper.pattern', name: 'pattern', selector: { text: {}}}
        ]
      },
      {
        type: 'grid',
        name: 'recycle',
        schema: [
          { label: 'recycle.label', name: 'label', selector: { text: {}}},
          {
            label: 'recycle.icon',
            name: 'icon',
            selector: { icon: {}},
            // eslint-disable-next-line @typescript-eslint/naming-convention
            context: { icon_entity: 'entity' }
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { label: 'recycle.color', name: 'color', selector: { mush_color: {}}},
          { label: 'recycle.pattern', name: 'pattern', selector: { text: {}}}
        ]
      },
      {
        type: 'grid',
        name: 'waste',
        schema: [
          { label: 'waste.label', name: 'label', selector: { text: {}}},
          {
            label: 'waste.icon',
            name: 'icon',
            selector: { icon: {}},
            // eslint-disable-next-line @typescript-eslint/naming-convention
            context: { icon_entity: 'entity' }
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { label: 'waste.color', name: 'color', selector: { mush_color: {}}},
          { label: 'waste.pattern', name: 'pattern', selector: { text: {}}}
        ]
      },
      {
        type: 'grid',
        name: 'others',
        schema: [
          {
            label: 'others.icon',
            name: 'icon',
            selector: { icon: {}},
            // eslint-disable-next-line @typescript-eslint/naming-convention
            context: { icon_entity: 'entity' }
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { label: 'others.color', name: 'color', selector: { mush_color: {}}}
        ]
      }
    ]
  },
  {
    type: 'grid',
    name: '',
    schema: [
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { name: 'layout', selector: { mush_layout: {}}},
      { name: 'fill_container', selector: { boolean: {}}},
      { name: 'next_days',
        selector: { number: {
          min: 1,
          max: 365,
          step: 1,
          mode: 'box'
        }}}
    ]
  }
];

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

  public connectedCallback (): void {
    super.connectedCallback();
    // eslint-disable-next-line no-void
    void loadHaComponents();
  }

  public setConfig (config: TrashCardConfig): void {
    assert(config, entityCardConfigStruct);
    this.config = config;
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

    if (GENERIC_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.generic.${schema.name}`);
    }
    if (schema.label && TRASH_LABELS.has(schema.label)) {
      return customLocalize(`editor.card.trash.${schema.label}`);
    }
    if (schema.label && OTHER_LABELS.has(schema.label)) {
      return customLocalize(`editor.card.generic.${schema.label}`);
    }

    return this.hass.localize(`ui.panel.lovelace.editor.card.generic.${schema.name}`);
  };

  protected render () {
    if (!this.hass || !this.config) {
      return nothing;
    }

    /* eslint-disable @typescript-eslint/unbound-method */
    return html`
            <ha-form
                .hass=${this.hass}
                .data=${this.config}
                .schema=${SCHEMA}
                .computeLabel=${this.computeLabel}
                @value-changed=${this.valueChanged}
            ></ha-form>
        `;
    /* eslint-enable @typescript-eslint/unbound-method */
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
            `
    ];
  }
}
