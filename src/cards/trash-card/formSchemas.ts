import type { HaFormSchema } from '../../utils/form/ha-form';
import type setupCustomlocalize from '../../localize';

// eslint-disable-next-line @typescript-eslint/naming-convention
const SCHEMA_PATTERN_OTHERS: HaFormSchema[] = [
  {
    label: 'icon',
    name: 'icon',
    selector: { icon: {}},
    // eslint-disable-next-line @typescript-eslint/naming-convention
    context: { icon_entity: 'entity' }
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  { label: 'color', name: 'color', selector: { ui_color: {}}}

];

// eslint-disable-next-line @typescript-eslint/naming-convention
const SCHEMA_PATTERN: HaFormSchema[] = [
  { label: 'label', name: 'label', selector: { text: {}}},
  ...SCHEMA_PATTERN_OTHERS,
  { label: 'pattern', name: 'pattern', selector: { text: {}}}
];

const getSchema = (customLocalize: ReturnType<typeof setupCustomlocalize>) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const settings: HaFormSchema[] = [

    // eslint-disable-next-line @typescript-eslint/naming-convention
    { name: 'filter_events', selector: { boolean: {}}},
    { name: 'drop_todayevents_from',
      default: {
        hours: 11,
        minutes: 0,
        seconds: 0
      },
      selector: {
        time: {
        }
      }},
    { name: 'next_days',
      selector: { number: {
        min: 1,
        max: 365,
        step: 1,
        mode: 'box'
      }}}

  ];

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const appearance: HaFormSchema[] = [

    // eslint-disable-next-line @typescript-eslint/naming-convention
    { name: 'layout', selector: { mush_layout: {}}},
    { name: 'fill_container', selector: { boolean: {}}},
    { name: 'full_size', selector: { boolean: {}}},
    { name: 'use_summary', selector: { boolean: {}}},
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { name: 'day_style', selector: { trashcard_datestyle: {}}},
    { name: 'hide_time_range', selector: { boolean: { }}},
    { name: 'items_per_row',
      selector: { number: {
        min: 1,
        max: 6,
        step: 1,
        mode: 'box'
      }}}
  ];

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const schema: HaFormSchema[] = [
    { name: 'entity', selector: { entity: { domain: 'calendar' }}},
    {
      type: 'expandable',
      name: '',
      title: customLocalize('editor.form.tabs.settings'),
      icon: 'mdi:cog',
      schema: settings
    },
    {
      type: 'expandable',
      name: '',
      title: customLocalize('editor.form.tabs.appearance'),
      icon: 'mdi:palette',
      schema: appearance
    }
  ];

  return schema;
};

export {
  getSchema,
  SCHEMA_PATTERN,
  SCHEMA_PATTERN_OTHERS
};
