import type { TrashCardConfig } from './trash-card-config';
import type { HaFormSchema } from '../../utils/form/ha-form';
import type setupCustomlocalize from '../../localize';

const SCHEMA_PATTERN_OTHERS: HaFormSchema[] = [
  {
    label: 'icon',
    name: 'icon',
    selector: { icon: {}},
    context: { icon_entity: 'entity' }
  },
  { label: 'color', name: 'color', selector: { ui_color: {}}}

];

const SCHEMA_PATTERN: HaFormSchema[] = [
  { label: 'label', name: 'label', selector: { text: {}}},
  ...SCHEMA_PATTERN_OTHERS,
  { label: 'pattern', name: 'pattern', selector: { text: {}}}
];

const getSchema = (customLocalize: ReturnType<typeof setupCustomlocalize>, currentValues: TrashCardConfig) => {
  const settings: HaFormSchema[] = [

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

  const appearance: HaFormSchema[] = [

    { name: 'card_style', selector: { trashcard_cardstyle: {}}},
    {
      type: 'grid',
      name: '',
      schema: [
        { name: 'day_style', selector: { trashcard_datestyle: {}}},
        { name: 'hide_time_range', selector: { boolean: { }}},
        { name: 'use_summary', selector: { boolean: {}}},
        { name: 'event_grouping', selector: { boolean: { default: true }}}
      ]
    },
    ...currentValues.card_style !== 'chip' ?
      [{
        type: 'grid',
        name: '',
        schema: [
          { name: 'layout', selector: { mush_layout: {}}}
        ]
      },
      {
        type: 'grid',
        name: '',
        schema: [

          { name: 'full_size', selector: { boolean: {}}},
          { name: 'items_per_row',
            selector: { number: {
              min: 1,
              max: 6,
              step: 1,
              mode: 'box'
            }}}
        ]
      }] as HaFormSchema[] :
      [] as HaFormSchema[]
  ];

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
