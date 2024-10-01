import type { HTMLTemplateResult } from 'lit';
import type { HassEntities } from 'home-assistant-js-websocket';

 // eslint-disable-next-line @typescript-eslint/consistent-type-imports
 type TranslationDict = typeof import('../translations/en.json');

type FlattenObjectKeys<
  T extends Record<string, any>,
  TKey extends keyof T = keyof T,
> = TKey extends string
  ? T[TKey] extends Record<string, unknown>
    ? `${TKey}.${FlattenObjectKeys<T[TKey]>}`
    : `${TKey}`
  : never;

enum NumberFormat {
  language = 'language',
  system = 'system',
  comma_decimal = 'comma_decimal',
  decimal_comma = 'decimal_comma',
  space_comma = 'space_comma',
  none = 'none',
}

enum TimeFormat {
  language = 'language',
  system = 'system',
  am_pm = '12',
  twenty_four = '24',
}

enum TimeZone {
  local = 'local',
  server = 'server',
}

enum DateFormat {
  language = 'language',
  system = 'system',
  DMY = 'DMY',
  MDY = 'MDY',
  YMD = 'YMD',
}

enum FirstWeekday {
  language = 'language',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

type LocalizeKeys =
  | FlattenObjectKeys<Omit<TranslationDict, 'supervisor'>>
  | `panel.${string}`
  | `ui.common.back`
  | `ui.card.alarm_control_panel.${string}`
  | `ui.card.weather.attributes.${string}`
  | `ui.card.weather.cardinal_direction.${string}`
  | `ui.card.lawn_mower.actions.${string}`
  | `ui.components.calendar.event.rrule.${string}`
  | `ui.components.logbook.${string}`
  | `ui.components.selectors.file.${string}`
  | `ui.dialogs.entity_registry.editor.${string}`
  | `ui.dialogs.more_info_control.lawn_mower.${string}`
  | `ui.dialogs.more_info_control.vacuum.${string}`
  | `ui.dialogs.quick-bar.commands.${string}`
  | `ui.dialogs.unhealthy.reason.${string}`
  | `ui.dialogs.unsupported.reason.${string}`
  | `ui.panel.config.${string}.${'caption' | 'description'}`
  | `ui.panel.config.dashboard.${string}`
  | `ui.panel.config.zha.${string}`
  | `ui.panel.config.zwave_js.${string}`
  | `ui.panel.lovelace.card.${string}`
  | `ui.panel.lovelace.editor.${string}`
  | `ui.panel.page-authorize.form.${string}`
  | `component.${string}`;

interface FrontendLocaleData {
  language: string;
  number_format: NumberFormat;
  time_format: TimeFormat;
  date_format: DateFormat;
  first_weekday: FirstWeekday;
  time_zone: TimeZone;
}

interface ThemeVars {

  // Incomplete
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'primary-color': string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'text-primary-color': string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'accent-color': string;
  [key: string]: string;
}

 type Theme = ThemeVars & {
   modes?: {
     light?: ThemeVars;
     dark?: ThemeVars;
   };
 };

 type LocalizeFunc<T extends string = LocalizeKeys> = (
   key: T,
   values?: Record<
   string,
   string | number | HTMLTemplateResult | null | undefined
   >
 ) => string;

interface HomeAssistant {
  states: HassEntities;
  callApi: <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>
  ) => Promise<T>;
  language: string;
  hassUrl: (path?) => string;
  themes: {
    default_theme: string;
    default_dark_theme: string | null;
    themes: Record<string, Theme>;

    // Currently effective dark mode. Will never be undefined. If user selected "auto"
    // in theme picker, this property will still contain either true or false based on
    // what has been determined via system preferences and support from the selected theme.
    darkMode: boolean;

    // Currently globally active theme name
    theme: string;
  };
  localize: LocalizeFunc;
  locale: FrontendLocaleData;
}

// Export type { HomeAssistant as MushHa } from 'home-assistant-frontend/src/types';

export type {
  HomeAssistant,
  LocalizeFunc
};
