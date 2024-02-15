import { animations } from 'lovelace-mushroom/src/utils/entity-styles';
import type { Appearance } from 'lovelace-mushroom/src/shared/config/appearance-config';
import type { CalendarItem } from '../../utils/calendarItem';
import { cardStyle } from 'lovelace-mushroom/src/utils/card-styles';
import { classMap } from 'lit/directives/class-map.js';
import { computeAppearance } from 'lovelace-mushroom/src/utils/appearance';
import { computeInfoDisplay } from 'lovelace-mushroom/src/utils/info';
import { eventsToItems } from '../../utils/eventsToItems';
import { filterDuplicatedItems } from '../../utils/filterDuplicatedItems';
import { findActiveEvents } from '../../utils/findActiveEvents';
import { getDayFromDate } from '../../utils/getDayFromDate';
import type { HassEntity } from 'home-assistant-js-websocket';
import type { HomeAssistant } from '../../utils/ha';
import { isTodayAfter } from '../../utils/isTodayAfter';
import { loadHaComponents } from 'lovelace-mushroom/src/utils/loader';
import { normaliseEvents } from '../../utils/normaliseEvents';
import { registerCustomCard } from '../../utils/registerCustomCard';
import setupCustomlocalize from '../../localize';
import { styleMap } from 'lit/directives/style-map.js';
import type { TrashCardConfig } from './trash-card-config';
import { actionHandler, computeRTL, computeStateDisplay, hasAction, type LovelaceCard, type LovelaceCardEditor } from 'lovelace-mushroom/src/ha';
import type { CalendarEvent, RawCalendarEvent } from '../../utils/calendarEvents';
import { computeRgbColor, defaultColorCss, defaultDarkColorCss } from 'lovelace-mushroom/src/utils/colors';
import { css, type CSSResultGroup, html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { themeColorCss, themeVariables } from 'lovelace-mushroom/src/utils/theme';
import { TRASH_CARD_EDITOR_NAME, TRASH_CARD_NAME } from './const';

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

  public static async getStubConfig (hass: HomeAssistant): Promise<Partial<TrashCardConfig>> {
    const entities = Object.keys(hass.states);

    return {
      type: `custom:${TRASH_CARD_NAME}`,
      entity: entities[0]
    };
  }

  @state() private config?: TrashCardConfig;

  @property() private currentItems?: CalendarItem[];

  @property() private startDate: Date = new Date();

  @property() private endDate: Date = new Date();

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

  public setDateRange () {
    this.startDate = new Date();
    this.endDate = new Date();

    this.endDate.setDate(this.endDate.getDate() + (this.config?.next_days ?? 2));
  }

  protected fetchCurrentTrashData () {
    if (!this.hass) {
      return;
    }

    this.setDateRange();

    const start = getDayFromDate(this.startDate);
    const end = getDayFromDate(this.endDate);

    const uri = `calendars/${this.config?.entity}?start=${start}&end=${end}`;

    const dropAfter = isTodayAfter(new Date(), this.config!.drop_todayevents_from ?? '10:00:00');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.hass.
      callApi<RawCalendarEvent[]>('GET', uri).
      then((response): CalendarEvent[] => normaliseEvents(response)).
      then((data: CalendarEvent[]): CalendarEvent[] =>
        findActiveEvents(data, {
          config: {
            settings: this.config!.settings!,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            filter_events: this.config!.filter_events
          },
          dropAfter,
          now: new Date()
        })).
      then((data: CalendarEvent[]): CalendarItem[] =>
        eventsToItems(data, {
          settings: this.config!.settings!,
          useSummary: Boolean(this.config!.use_summary)
        })).
      then((data: CalendarItem[]): CalendarItem[] =>
        !this.config!.event_grouping ?
          data :
          filterDuplicatedItems(data)).
      then((data: CalendarItem[]) => {
        this.currentItems = data;
        this.lastChanged = new Date();
      });
  }

  protected shouldUpdate (changedProps: PropertyValues): boolean {
    if (changedProps.has('currentItems')) {
      return true;
    }
    changedProps.delete('currentItems');
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

  protected getDateString (item: CalendarItem, excludeTime?: boolean): string {
    if (!this.hass) {
      return '';
    }

    const customLocalize = setupCustomlocalize(this.hass);

    const today = new Date();
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDay = getDayFromDate(today);
    const tomorrowDay = getDayFromDate(tomorrow);

    const stateDay = getDayFromDate(item.date.start);

    const startTime = !item.isWholeDayEvent ?
      item.date.start.toLocaleTimeString(this.hass.language, {
        hour: 'numeric',
        minute: 'numeric'
      }) :
      undefined;

    const endTime = !item.isWholeDayEvent ?
      item.date.end.toLocaleTimeString(this.hass.language, {
        hour: 'numeric',
        minute: 'numeric'
      }) :
      undefined;

    if (stateDay === todayDay || stateDay === tomorrowDay) {
      const key = `card.trash.${stateDay === todayDay ? 'today' : 'tomorrow'}${startTime && !excludeTime ? '_from_till' : ''}`;

      return `${customLocalize(`${key}`).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '')}`;
    }

    if (this.config?.day_style === 'counter') {
      const oneDay = 24 * 60 * 60 * 1_000;

      const todayMorning = new Date();

      todayMorning.setHours(0);
      todayMorning.setMinutes(0);
      todayMorning.setSeconds(0);

      const daysLeft = Math.round(Math.abs((todayMorning.getTime() - item.date.start.getTime()) / oneDay));

      return `${customLocalize(`card.trash.daysleft${daysLeft > 1 ? '_more' : ''}${startTime && !excludeTime ? '_from_till' : ''}`).replace('<DAYS>', `${daysLeft}`).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '')}`;
    }

    const day = item.date.start.toLocaleDateString(this.hass.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const key = `card.trash.day${startTime && !excludeTime ? '_from_till' : ''}`;

    return customLocalize(`${key}`).replace('<DAY>', day).replace('<START>', startTime ?? '').replace('<END>', endTime ?? '');
  }

  protected render () {
    if (!this.config || !this.hass || !this.config.entity) {
      return nothing;
    }

    const entityId = this.config.entity;
    const stateObj = this.hass.states[entityId] as HassEntity | undefined;
    const items = this.currentItems;

    if (!stateObj || !items || items.length === 0) {
      return nothing;
    }

    const itemsPerRow = this.config.items_per_row ?? 1;

    const cssStyleMap = styleMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'grid-template-columns': `repeat(${itemsPerRow}, calc(calc(100% - ${(itemsPerRow - 1) * 5}px) / ${itemsPerRow}))`
    });

    return html`
            <div style=${cssStyleMap}>
              ${items.map(item => this.renderItem(item))}
            </div>
        `;
  }

  protected renderItem (item: CalendarItem) {
    if (!this.config || !this.hass || !this.config.entity) {
      return nothing;
    }

    const entityId = this.config.entity;
    const stateObj = this.hass.states[entityId] as HassEntity | undefined;

    if (!stateObj) {
      return nothing;
    }

    const appearance = computeAppearance(this.config);

    const rtl = computeRTL(this.hass);

    const { label } = item;
    const color = item.color ?? 'disabled';

    const backgroundStyle = {};

    if (color !== 'disabled') {
      const rgbColor = computeRgbColor(color);

      backgroundStyle['background-color'] = `rgba(${rgbColor}, 0.5)`;
    }

    const secondary = this.getDateString(item, this.config.hide_time_range ?? false);

    const cssClassMap = classMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fill-container': appearance.fill_container,
      fullsize: this.config.full_size === true
    });

    return html`
<ha-card class=${cssClassMap} style=${styleMap(backgroundStyle)}>
        <mushroom-card .appearance=${appearance} ?rtl=${rtl}>
            <mushroom-state-item
                ?rtl=${rtl}
                .appearance=${appearance}
                .actionHandler=${actionHandler({ hasHold: hasAction(this.config.hold_action), hasDoubleClick: hasAction(this.config.double_tap_action) })}
            >
                ${this.renderIcon(stateObj, item)}
    <mushroom-state-info
        slot="info"
      .primary=${label}
      .secondary=${secondary}
      .multiline_secondary=${true}
      ></mushroom-state-info>
      </mushroom-state-item>
          </mushroom-card>
        </ha-card>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderIcon (stateObj: HassEntity, item: CalendarItem): TemplateResult {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const icon = item.icon ?? 'mdi:delete-outline';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const iconColor = item.color ?? 'disabled';

    const iconStyle = {};

    iconStyle['--icon-color'] = `rgba(var(--white-color), 0.5)`;

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
          div {
            display: grid;
            grid-gap:5px;
          }
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
