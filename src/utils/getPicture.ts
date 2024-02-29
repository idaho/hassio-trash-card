import type { HomeAssistant } from './ha';

const getPicture = (url: string | undefined, hass: HomeAssistant): string | undefined =>
  url ? `${hass.hassUrl(url)}` : undefined;

export {
  getPicture
};
