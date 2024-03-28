import { getDayFromDate } from '../../utils/getDayFromDate';
import { isTodayAfter } from '../../utils/isTodayAfter';
import { registerCustomCard } from '../../utils/registerCustomCard';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TRASH_CARD_EDITOR_NAME, TRASH_CARD_NAME } from './const';
import { Debugger } from '../../utils/debugger';
import { getCalendarData } from '../../utils/getCalendarData';
import { getTimeZoneOffset } from '../../utils/getTimeZoneOffset';
import { migrateConfig, needsConfigToMigrate } from './utils/migration';

import './container';

import type { PropertyValues } from 'lit';
import type { TrashCardConfig } from './trash-card-config';
import type { HomeAssistant } from '../../utils/ha';
import type { CalendarItem } from '../../utils/calendarItem';
import type { BaseContainerElement } from './container/BaseContainerElement';

registerCustomCard({
  type: TRASH_CARD_NAME,
  name: 'TrashCard',
  description: 'TrashCard - indicates what type of trash will be picked up next based on your calendar entries 🗑️'
});

const configDefaults = {
  tap_action: {
    action: 'more-info'
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  hold_action: {
    action: 'more-info'
  },
  with_label: true,
  debug: false
};

@customElement(TRASH_CARD_NAME)
export class TrashCard extends LitElement {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @state() private _hass?: HomeAssistant;

  public static async getConfigElement () {
    await import('./trash-card-editor');

    return document.createElement(TRASH_CARD_EDITOR_NAME);
  }

  public static async getStubConfig (hass: HomeAssistant): Promise<Partial<TrashCardConfig>> {
    const entities = Object.keys(hass.states);

    return {
      type: `custom:${TRASH_CARD_NAME}`,
      entities: [ entities[0] ]
    };
  }

  @state() private config?: TrashCardConfig;

  @property() private currentItems?: CalendarItem[];

  @property() private startDate: Date = new Date();

  @property() private endDate: Date = new Date();

  @property() private debugger?: Debugger;

  private lastChanged?: Date;

  public get hass (): HomeAssistant | undefined {
    // eslint-disable-next-line no-underscore-dangle
    return this._hass;
  }

  public set hass (hass: HomeAssistant) {
    // eslint-disable-next-line no-underscore-dangle
    this._hass = hass;
    this.shadowRoot?.querySelectorAll('div > *').forEach((element: unknown) => {
      // eslint-disable-next-line no-param-reassign
      (element as BaseContainerElement).setHass(hass);
    });
  }

  public setConfig (config: TrashCardConfig): void {
    this.config = {
      ...configDefaults,
      ...needsConfigToMigrate(config) ? migrateConfig(config) : config
    };

    this.debugger = new Debugger();
  }

  public setDateRange () {
    this.startDate = new Date();
    this.endDate = new Date();

    this.endDate.setDate(this.endDate.getDate() + (this.config?.next_days ?? 2) + 1);
  }

  protected fetchCurrentTrashData () {
    if (!this.hass || !this.config || !this.debugger) {
      return;
    }

    this.setDateRange();

    const start = getDayFromDate(this.startDate);
    const end = getDayFromDate(this.endDate);

    const dropAfter = isTodayAfter(new Date(), this.config.drop_todayevents_from ?? '10:00:00');
    const timezoneOffset = getTimeZoneOffset();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCalendarData(
      this.hass,
      this.config.entities,
      { start, end, dropAfter },
      this.debugger,
      this.config,
      timezoneOffset
    ).
      then((data: CalendarItem[]) => {
        this.currentItems = data;
        this.lastChanged = new Date();
      });
  }

  protected getRefreshRate (): number {
    return (this.config?.refresh_rate ?? 60) * 60 * 1_000;
  }

  protected shouldUpdate (changedProps: PropertyValues): boolean {
    if (changedProps.has('currentItems')) {
      return true;
    }

    changedProps.delete('currentItems');

    if (!this.lastChanged || changedProps.has('config') || Date.now() - this.lastChanged.getTime() > this.getRefreshRate()) {
      this.fetchCurrentTrashData();
    }

    return false;
  }

  protected createBaseContainerElement (cardStyle: TrashCardConfig['card_style']) {
    try {
      const tag = `trash-card-${cardStyle ?? 'card'}s-container`;

      if (customElements.get(tag)) {
        // @ts-expect-error TS2769
        const element = document.createElement(tag, this.config) as BaseContainerElement;

        element.setConfig(this.config);
        element.setItems(this.currentItems);

        return element;
      }

      const element = document.createElement(tag) as BaseContainerElement;

      customElements.whenDefined(tag).
        then(() => {
          customElements.upgrade(element);
          element.setConfig(this.config);
          element.setItems(this.currentItems);
        }).
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        catch(() => {
        });

      return element;
    // eslint-disable-next-line no-empty
    } catch {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }
  }

  protected render () {
    if (!this.config || !this.hass) {
      return nothing;
    }

    if (!this.currentItems || this.currentItems.length === 0) {
      return this.config.debug ? html`<trash-card-debug-container .debugger=${this.debugger}></trash-card-debug-card>` : nothing;
    }

    const element = this.createBaseContainerElement(this.config.card_style);

    if (!element) {
      return nothing;
    }

    element.setHass(this.hass);

    return html`
      ${this.config.debug ? html`<trash-card-debug-container .debugger=${this.debugger}></trash-card-debug-card>` : ``}
      ${element}`;
  }
}
