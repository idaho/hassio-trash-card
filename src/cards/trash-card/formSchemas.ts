import { CARDSTYLES, COLORMODES, DAYSTYLES } from './trash-card-config';

import type { TrashCardConfig } from './trash-card-config';
import type { HaFormSchema } from '../../utils/form/ha-form';
import type setupCustomlocalize from '../../localize';

const getPatternOthersSchema = (localize: (key: string, ...args: any) => string) => [
  {
    name: 'icon',
    label: localize(`ui.panel.lovelace.editor.card.generic.icon`),
    selector: {
      icon: {}
    },
    context: { icon_entity: 'entity' }
  },
  {
    name: 'color',
    label: localize(`ui.panel.lovelace.editor.card.tile.color`),
    selector: { ui_color: {}}
  }
];

const getPatternSchema = (customLocalize: ReturnType<typeof setupCustomlocalize>, localize: (key: string, ...args: any) => string) => [
  {
    label: customLocalize(`editor.card.trash.pattern.fields.label`),
    name: 'label',
    selector: {
      text: {}
    }
  },
  ...getPatternOthersSchema(localize),
  {
    label: customLocalize(`editor.card.trash.pattern.fields.pattern`),
    name: 'pattern',
    selector: {
      text: {}
    }
  }
];

const getSchema = (customLocalize: ReturnType<typeof setupCustomlocalize>, currentValues: TrashCardConfig, localize: (key: string, ...args: any) => string) => {
  const settings: HaFormSchema[] = [

    {
      type: 'grid',
      name: '',
      schema: [

        {
          name: 'filter_events',
          label: customLocalize(`editor.card.generic.filter_events`),
          selector: { boolean: {}}
        },
        {
          name: 'drop_todayevents_from',
          label: customLocalize(`editor.card.generic.drop_todayevents_from`),
          default: {
            hours: 11,
            minutes: 0,
            seconds: 0
          },
          selector: {
            time: {
            }
          }
        },
        {
          name: 'next_days',
          label: customLocalize(`editor.card.generic.next_days`),
          selector: {
            number: {
              min: 1,
              max: 365,
              step: 1,
              mode: 'box'
            }
          }
        },
        {
          name: 'refresh_rate',
          label: customLocalize(`editor.form.refresh_rate.title`),
          helper: customLocalize(`editor.form.refresh_rate.helper`),
          selector: {
            number: {
              min: 5,
              max: 1_440,
              step: 5,
              mode: 'box'
            }
          }
        }
      ]
    }
  ];

  const appearance: HaFormSchema[] = [

    {
      name: 'card_style',
      label: customLocalize(`editor.form.card_style.title`),
      selector: {
        select: {
          options: [ ...CARDSTYLES ].map(control => ({
            value: control,
            label: customLocalize(`editor.form.card_style.values.${control}`)
          })),
          mode: 'dropdown'
        }
      }
    },
    {
      type: 'grid',
      name: '',
      schema: [
        ...currentValues.card_style === 'icon' ?
          [{
            name: 'icon_size',
            label: customLocalize(`editor.card.generic.icon_size`),
            selector: {
              number: {
                min: 10,
                max: 160,
                step: 1,
                mode: 'box'
              }
            }
          }] as HaFormSchema[] :
          [],
        ...currentValues.card_style === 'card' || currentValues.card_style === 'chip' ?
          [{
            name: 'day_style',
            label: customLocalize(`editor.form.day_style.title`),
            selector: {
              select: {
                options: [ ...DAYSTYLES ].map(control => ({
                  value: control,
                  label: customLocalize(`editor.form.day_style.values.${control}`)
                })),
                mode: 'dropdown'
              }
            }
          }] as HaFormSchema[] :
          [],
        ...currentValues.card_style === 'card' || currentValues.card_style === 'chip' ?
          [{
            name: 'hide_time_range',
            label: customLocalize(`editor.card.generic.hide_time_range`),
            selector: { boolean: { }}
          }] as HaFormSchema[] :
          [],
        ...currentValues.card_style === 'card' || currentValues.card_style === 'chip' ?
          [{
            name: 'with_label',
            label: customLocalize(`editor.card.generic.with_label`),
            selector: { boolean: {}}
          }] as HaFormSchema[] :
          [],

        ...currentValues.with_label && (currentValues.card_style === 'card' || currentValues.card_style === 'chip') ?
          [{
            name: 'use_summary',
            label: customLocalize(`editor.card.generic.use_summary`),
            selector: { boolean: {}}
          }] as HaFormSchema[] :
          [],
        ...currentValues.card_style === 'card' || currentValues.card_style === 'chip' ?
          [{
            name: 'event_grouping',
            label: customLocalize(`editor.card.generic.event_grouping`),
            selector: { boolean: { default: true }}
          }] as HaFormSchema[] :
          [],
        ...currentValues.card_style === 'card' || currentValues.card_style === 'chip' ?
          [{
            name: 'color_mode',
            label: customLocalize(`editor.form.color_mode.title`),
            selector: {
              select: {
                options: [ ...COLORMODES ].map(control => ({
                  value: control,
                  label: customLocalize(`editor.form.color_mode.values.${control}`)
                })),
                mode: 'dropdown'
              }
            }
          }] as HaFormSchema[] :
          []
      ]
    },
    ...currentValues.card_style === 'card' ?
      [{
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'layout',
            label: customLocalize(`editor.card.generic.layout`),
            selector: { mush_layout: {}}
          }
        ]
      },
      {
        type: 'grid',
        name: '',
        schema: [

          {
            name: 'full_size',
            label: customLocalize(`editor.card.generic.full_size`),
            selector: { boolean: {}}
          },
          {
            name: 'items_per_row',
            label: localize(`ui.panel.lovelace.editor.card.grid.columns`),
            selector: { number: {
              min: 1,
              max: 6,
              step: 1,
              mode: 'box'
            }}
          }
        ]
      }] as HaFormSchema[] :
      []
  ];

  const schema: HaFormSchema[] = [
    {
      name: 'entities',
      selector: {
        entity: {
          domain: 'calendar',
          multiple: true
        }
      }
    },
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
  getPatternSchema,
  getPatternOthersSchema
};
