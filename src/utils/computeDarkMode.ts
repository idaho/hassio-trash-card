import type { HomeAssistant } from './ha';

const computeDarkMode = (hass?: HomeAssistant): boolean => {
  if (!hass) {
    return false;
  }

  return (hass.themes as any).darkMode as boolean;
};

export {
  computeDarkMode
};
