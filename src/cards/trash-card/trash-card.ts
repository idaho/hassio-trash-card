import { animations } from 'lovelace-mushroom/src/utils/entity-styles';
import { cardStyle } from 'lovelace-mushroom/src/utils/card-styles';
import { eventsToItems } from '../../utils/eventsToItems';
import { filterDuplicatedItems } from '../../utils/filterDuplicatedItems';
import { findActiveEvents } from '../../utils/findActiveEvents';
import { getDayFromDate } from '../../utils/getDayFromDate';
import { isTodayAfter } from '../../utils/isTodayAfter';
import { loadHaComponents } from 'lovelace-mushroom/src/utils/loader';
import { normaliseEvents } from '../../utils/normaliseEvents';
import { registerCustomCard } from '../../utils/registerCustomCard';
import { defaultColorCss, defaultDarkColorCss } from 'lovelace-mushroom/src/utils/colors';
import { css, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { themeColorCss, themeVariables } from 'lovelace-mushroom/src/utils/theme';
import { TRASH_CARD_EDITOR_NAME, TRASH_CARD_NAME } from './const';
import { Chip } from './elements/chip';
import { Card } from './elements/card';

import type { CSSResultGroup, PropertyValues } from 'lit';
import type { LovelaceCard, LovelaceCardEditor } from 'lovelace-mushroom/src/ha';
import type { CalendarEvent, RawCalendarEvent } from '../../utils/calendarEvents';
import type { TrashCardConfig } from './trash-card-config';
import type { HomeAssistant } from '../../utils/ha';
import type { HassEntity } from 'home-assistant-js-websocket';
import type { CalendarItem } from '../../utils/calendarItem';

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
    if (!this.lastChanged || changedProps.has('config') || Date.now() - this.lastChanged.getTime() > 5_000) {
      this.fetchCurrentTrashData();
    }

    return false;
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

    const elementInstance = this.config.card_style === 'chip' ?
      new Chip(this.config, this.hass) :
      new Card(this.config, this.hass);

    return elementInstance.renderItems(items);
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
      ...Chip.getStyles(),
      ...Card.getStyles(),
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
        `
    ];
  }
}
