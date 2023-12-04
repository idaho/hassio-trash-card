import { animations } from 'lovelace-mushroom/src/utils/entity-styles';
import type { Appearance } from 'lovelace-mushroom/src/shared/config/appearance-config';
import { cardStyle } from 'lovelace-mushroom/src/utils/card-styles';
import { classMap } from 'lit/directives/class-map.js';
import { computeAppearance } from 'lovelace-mushroom/src/utils/appearance';
import { computeInfoDisplay } from 'lovelace-mushroom/src/utils/info';
import type { HassEntity } from 'home-assistant-js-websocket';
import { loadHaComponents } from 'lovelace-mushroom/src/utils/loader';
import { registerCustomCard } from 'lovelace-mushroom/src/utils/custom-cards';
import setupCustomlocalize from '../../localize';
import { styleMap } from 'lit/directives/style-map.js';
import type { TrashCardConfig } from './trash-card-config';
import { actionHandler, computeRTL, computeStateDisplay, hasAction, type HomeAssistant, type LovelaceCard, type LovelaceCardEditor } from 'lovelace-mushroom/src/ha';
import { computeRgbColor, defaultColorCss, defaultDarkColorCss } from 'lovelace-mushroom/src/utils/colors';
import { css, type CSSResultGroup, html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { themeColorCss, themeVariables } from 'lovelace-mushroom/src/utils/theme';
import { TRASH_CARD_EDITOR_NAME, TRASH_CARD_NAME, type TrashData, type TrashDataItem } from './const';

registerCustomCard({
  type: TRASH_CARD_NAME,
  name: 'TrashCard',
  description: 'TrashCard - indicates what type of trash will be picked up next based on your calendar entries 🗑️'
});

@customElement(TRASH_CARD_NAME)
export class TrashCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  public static async getConfigElement (): Promise<LovelaceCardEditor> {
    await import('./trash-card-editor');

    return document.createElement(TRASH_CARD_EDITOR_NAME) as LovelaceCardEditor;
  }

  public static async getStubConfig (hass: HomeAssistant): Promise<TrashCardConfig> {
    const entities = Object.keys(hass.states);

    return {
      type: `custom:${TRASH_CARD_NAME}`,
      entity: entities[0]
    };
  }

  @state() private config?: TrashCardConfig;

  @property() private trashData?: TrashData;

  private lastChanged?: Date;

  public connectedCallback () {
    super.connectedCallback();
    // eslint-disable-next-line no-void
    void loadHaComponents();
  }

  // eslint-disable-next-line class-methods-use-this
  public getCardSize (): number | Promise<number> {
    return 1;
  }

  public setConfig (config: TrashCardConfig): void {
    this.config = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      tap_action: {
        action: 'more-info'
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      hold_action: {
        action: 'more-info'
      },
      ...config
    };
  }

  private getTrashItem (data): TrashDataItem | undefined {
    const { settings } = this.config!;

    if (!data || !('summary' in data)) {
      return {
        type: 'none'
      };
    }

    const { summary: value } = data;

    if (value.includes(settings?.organic?.pattern)) {
      return {
        ...settings?.organic,
        data,
        type: 'organic'
      };
    }
    if (value.includes(settings?.paper?.pattern)) {
      return {
        ...settings?.paper,
        data,
        type: 'paper'
      };
    }
    if (value.includes(settings?.recycle?.pattern)) {
      return {
        ...settings?.recycle,
        data,
        type: 'recycle'
      };
    }
    if (value.includes(settings?.waste?.pattern)) {
      return {
        ...settings?.waste,
        data,
        type: 'waste'
      };
    }

    return {
      ...settings?.others,
      data,
      type: 'others'
    };
  }

  protected fetchCurrentTrashData () {
    if (!this.hass) {
      return;
    }

    const today = new Date();
    const endDate = new Date();

    endDate.setDate(endDate.getDate() + 2);

    const start = this.getDayFromDate(today);
    const end = this.getDayFromDate(endDate);

    const uri = `calendars/${this.config?.entity}?start=${start}&end=${end}`;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.hass.
      callApi('GET', uri).
      then((response: any): TrashData => {
        if (response.length === 0) {
          return {
            date: new Date(),
            item: undefined
          };
        }

        const todaysItem = response.find(item => item.start.date === start);

        const firstNextItem = response.
          filter(item => item.start.date !== start).
          sort((first, second) => `${first.start.date}`.localeCompare(`${second.start.date}`))[0];

        const item = today.getHours() <= 10 ? todaysItem ?? firstNextItem : firstNextItem;

        return {
          date: item ? new Date(item.start.date) : new Date(),
          item: this.getTrashItem(item)
        };
      }).
      then((data: TrashData) => {
        this.trashData = data;
        this.lastChanged = new Date();
      });
  }

  protected shouldUpdate (changedProps: PropertyValues): boolean {
    if (changedProps.has('trashData')) {
      return true;
    }
    changedProps.delete('trashData');
    if (
      !this.lastChanged ||
            changedProps.has('config') ||

            // Refresh only every 5s.
            Date.now() - this.lastChanged.getTime() > 5_000
    ) {
      this.fetchCurrentTrashData();
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  protected getDayFromDate (date: Date): string {
    return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
      2,
      '0'
    )}-${`${date.getDate()}`.padStart(2, '0')}`;
  }

  protected getDateString (): string {
    if (!this.trashData?.date || !this.hass) {
      return '';
    }

    const customLocalize = setupCustomlocalize(this.hass);

    const today = new Date();
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDay = this.getDayFromDate(today);
    const tomorrowDay = this.getDayFromDate(tomorrow);

    const stateDay = this.getDayFromDate(this.trashData.date);

    if (todayDay === stateDay) {
      return customLocalize('card.trash.today');
    }
    if (tomorrowDay === stateDay) {
      return customLocalize('card.trash.tomorrow');
    }

    return this.trashData.date.toLocaleDateString(this.hass.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  protected render () {
    if (!this.config || !this.hass || !this.config.entity) {
      return nothing;
    }

    const entityId = this.config.entity;
    const stateObj = this.hass.states[entityId] as HassEntity | undefined;

    if (!stateObj) {
      return nothing;
    }

    if (!this.trashData?.item || this.trashData.item.type === 'none') {
      return html``;
    }

    const appearance = computeAppearance(this.config);

    const rtl = computeRTL(this.hass);

    const color = this.trashData.item.color ?? 'disabled';

    const backgroundStyle = {};

    if (color !== 'disabled') {
      const rgbColor = computeRgbColor(color);

      backgroundStyle['background-color'] = `rgba(${rgbColor}, 0.5)`;
    }

    const secondary = this.getDateString();

    /* eslint-disable @typescript-eslint/naming-convention */
    return html`
            <ha-card
                class=${classMap({ 'fill-container': appearance.fill_container, fullsize: this.config.full_size === true })}
                style=${styleMap(backgroundStyle)}
            >
                <mushroom-card .appearance=${appearance} ?rtl=${rtl}>
                    <mushroom-state-item
                        ?rtl=${rtl}
                        .appearance=${appearance}
                        .actionHandler=${actionHandler({
    hasHold: hasAction(this.config.hold_action),
    hasDoubleClick: hasAction(this.config.double_tap_action)
  })}
                    >
                        ${this.renderIcon(stateObj)}
                        <mushroom-state-info
                            slot="info"
                            .primary=${this.trashData.item.type !== 'others' ?
    this.trashData.item.label ??
                                  this.trashData.item.data?.summary ??
                                  '' :
    this.trashData.item.data?.summary}
                            .secondary=${secondary}
                        ></mushroom-state-info>
                    </mushroom-state-item>
                </mushroom-card>
            </ha-card>
        `;
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  protected renderIcon (stateObj: HassEntity): TemplateResult {
    const icon = this.trashData?.item?.icon ?? 'mdi:delete-outline';
    const iconColor = this.trashData?.item?.color ?? 'disabled';

    const iconStyle = {};

    if (iconColor) {
      const iconRgbColor = computeRgbColor(iconColor);

      iconStyle['--icon-color'] = `rgb(${iconRgbColor})`;
      iconStyle['--shape-color'] = `rgba(${iconRgbColor}, 0.2)`;
    }

    return html`
            <mushroom-shape-icon
                slot="icon"
                .disabled=${iconColor === 'disabled'}
                style=${styleMap(iconStyle)}
            >
                <ha-state-icon .state=${stateObj} .icon=${icon}></ha-state-icon>
            </mushroom-shape-icon>
        `;
  }

  // Protected renderNotFound(config: any): TemplateResult {
  //     const appearance = computeAppearance(config);
  //     const rtl = computeRTL(this.hass);

  //     const customLocalize = setupCustomlocalize(this.hass);

  //     return html`
  //         <ha-card class=${classMap({ "fill-container": appearance.fill_container })}>
  //             <mushroom-card .appearance=${appearance} ?rtl=${rtl}>
  //                 <mushroom-state-item ?rtl=${rtl} .appearance=${appearance} disabled>
  //                     <mushroom-shape-icon slot="icon" disabled>
  //                         <ha-icon icon="mdi:help"></ha-icon>
  //                     </mushroom-shape-icon>
  //                     <mushroom-badge-icon
  //                         slot="badge"
  //                         class="not-found"
  //                         icon="mdi:exclamation-thick"
  //                     ></mushroom-badge-icon>
  //                     <mushroom-state-info
  //                         slot="info"
  //                         .primary=${config.entity}
  //                         secondary=${customLocalize("card.not_found")}
  //                     ></mushroom-state-info>
  //                 </mushroom-state-item>
  //             </mushroom-card>
  //         </ha-card>
  //     `;
  // }

  protected renderStateInfo (
    stateObj: HassEntity,
    appearance: Appearance,
    name: string,
    currentState?: string
  ): TemplateResult | null {
    if (!this.hass) {
      return null;
    }

    const defaultState = computeStateDisplay(
      this.hass.localize,
      stateObj,
      this.hass.locale,
      this.hass.config,
      this.hass.entities
    );
    const displayState = currentState ?? defaultState;

    const primary = computeInfoDisplay(
      appearance.primary_info,
      name,
      displayState,
      stateObj,
      this.hass
    );

    const secondary = computeInfoDisplay(
      appearance.secondary_info,
      name,
      displayState,
      stateObj,
      this.hass
    );

    return html`
            <mushroom-state-info
                slot="info"
                .primary=${primary}
                .secondary=${secondary}
            ></mushroom-state-info>
        `;
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
            `,
      cardStyle,
      css`
                ha-card.fullsize {
                    margin-left: -17px;
                    margin-right: -17px;
                    margin-top: -4px;
                }
                mushroom-state-item {
                    cursor: pointer;
                }
                mushroom-shape-icon {
                    --icon-color: rgb(var(--rgb-state-entity));
                    --shape-color: rgba(var(--rgb-state-entity), 0.2);
                }
            `
    ];
  }
}
