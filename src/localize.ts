import * as cs from './translations/cs.json';
import * as da from './translations/da.json';
import * as de from './translations/de.json';
import * as en from './translations/en.json';
import * as fr from './translations/fr.json';
import * as hu from './translations/hu.json';
import * as it from './translations/it.json';
import * as lv from './translations/lv.json';
import * as nb from './translations/nb.json';
import * as nl from './translations/nl.json';
import * as pl from './translations/pl.json';
import * as ptBr from './translations/pt-br.json';
import * as sk from './translations/sk.json';
import * as sl from './translations/sl.json';
import * as sv from './translations/sv.json';

import type { HTMLTemplateResult } from 'lit';
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
  nb,
  nl,
  pl,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'pt-BR': ptBr,
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

const nonNullable = <T extends unknown | null | undefined> (value: T): value is NonNullable<T> => value !== undefined && value !== null;

export default function setupCustomlocalize (hass?: HomeAssistant): LocalizeFunc {
  return function (key: string, values?: Record<string, string | number | HTMLTemplateResult | null | undefined>) {
    const lang = hass?.locale.language ?? DEFAULT_LANG;

    let translated = getTranslatedString(key, lang);

    if (!translated) {
      translated = getTranslatedString(key, DEFAULT_LANG);
    }

    if (values && translated) {
      for (const [ translateKey, translateValue ] of Object.entries(values)) {
        if (nonNullable(translateKey) && nonNullable(translateValue)) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          translated = translated.replace(`<${key}>`, translateValue.toString());
        }
      }
    }

    return translated ?? key;
  };
}
