import type { TrashCardConfig } from '../trash-card-config';
import type { ItemSettings } from '../../../utils/itemSettings';

interface SettingsOfConfig {
  settings: Record<ItemSettings['type'], ItemSettings>;
}
type OldConfigWithSetting = TrashCardConfig & Partial<SettingsOfConfig>;

type LegacayConfig = TrashCardConfig & SettingsOfConfig;

const needsConfigToMigrate = (config: Partial<OldConfigWithSetting>): config is LegacayConfig =>
  'settings' in config || 'entity' in config;

const migrateConfig = (config: LegacayConfig) => {
  const pattern: ItemSettings[] = [];
  const { settings, entity, ...restOfConfiguration } = config;

  const newConfiguration = {
    ...restOfConfiguration
  };

  if ('entity' in config) {
    newConfiguration.entities = Array.isArray(entity) ? entity : [ entity ];
  }

  if (!('settings' in config)) {
    return newConfiguration;
  }

  Object.entries(settings).forEach(([ type, data ]) => {
    pattern.push({
      ...data,
      type: type as ItemSettings['type']
    });
  });

  return {
    ...newConfiguration,
    pattern
  };
};

export {
  migrateConfig,
  needsConfigToMigrate
};
