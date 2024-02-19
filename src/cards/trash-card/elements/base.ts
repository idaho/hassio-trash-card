import type { HomeAssistant } from '../../../utils/ha';
import type { TrashCardConfig } from '../trash-card-config';

class Base {
  protected readonly config?: TrashCardConfig;

  public hass?: HomeAssistant;

  public constructor (config?: TrashCardConfig, hass?: HomeAssistant) {
    this.config = config;
    this.hass = hass;
  }
}

export {
  Base
};
