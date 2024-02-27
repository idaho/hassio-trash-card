import type { TrashCardConfig } from '../trash-card-config';
import type { ItemSettings } from '../../../utils/itemSettings';

interface SettingsOfConfig {
  settings: Record<ItemSettings['type'], ItemSettings>;
}
type OldConfigWithSetting = TrashCardConfig & Partial<SettingsOfConfig>;

type LegacayConfig = TrashCardConfig & SettingsOfConfig;

const needsConfigToMigrate = (config: Partial<OldConfigWithSetting>): config is LegacayConfig =>
  'settings' in config;

const migrateConfig = (config: LegacayConfig) => {
  const pattern: ItemSettings[] = [];
  const { settings, ...restOfConfiguration } = config;

  Object.entries(settings).forEach(([ type, data ]) => {
    pattern.push({
      ...data,
      type: type as ItemSettings['type']
    });
  });

  return {
    ...restOfConfiguration,
    pattern
  };
};

export {
  migrateConfig,
  needsConfigToMigrate
};
