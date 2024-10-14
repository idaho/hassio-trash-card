import * as cs from './translations/cs.json';
import * as da from './translations/da.json';
import * as de from './translations/de.json';
import * as en from './translations/en.json';
import * as fr from './translations/fr.json';
import * as hu from './translations/hu.json';
import * as it from './translations/it.json';
import * as lv from './translations/lv.json';
import * as nl from './translations/nl.json';
import * as pl from './translations/pl.json';
import * as sk from './translations/sk.json';
import * as sl from './translations/sl.json';
import * as sv from './translations/sv.json';

import type { HomeAssistant, LocalizeFunc } from './utils/ha';

const languages: Record<string, unknown> = {
  cs,
  da,
  de,
  en,
  fr,
  hu,
  it,
  lv,
  nl,
  pl,
  sk,
  sl,
  sv
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const DEFAULT_LANG = 'en';

const getTranslatedString = (key: string, lang: string): string | undefined => {
  try {
    return key.
      split('.').
      reduce((prev, current) => (prev as Record<string, unknown>)[current], languages[lang]) as string;
  } catch {
    return undefined;
  }
};

export default function setupCustomlocalize (hass?: HomeAssistant): LocalizeFunc {
  return function (key: string) {
    const lang = hass?.locale.language ?? DEFAULT_LANG;

    let translated = getTranslatedString(key, lang);

    if (!translated) {
      translated = getTranslatedString(key, DEFAULT_LANG);
    }

    return translated ?? key;
  };
}
