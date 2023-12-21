import type { HaFormSchema } from '../../utils/form/ha-form';

// eslint-disable-next-line @typescript-eslint/naming-convention
const SCHEMA_ENTITY: HaFormSchema[] = [
  { name: 'entity', selector: { entity: { domain: 'calendar' }}}
];

// eslint-disable-next-line @typescript-eslint/naming-convention
const SCHEMA_SETTINGS: HaFormSchema[] = [

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
const SCHEMA_APPEARANCE: HaFormSchema[] = [

  // eslint-disable-next-line @typescript-eslint/naming-convention
  { name: 'layout', selector: { mush_layout: {}}},
  { name: 'fill_container', selector: { boolean: {}}},
  { name: 'full_size', selector: { boolean: {}}},
  { name: 'use_summary', selector: { boolean: {}}}

];

// eslint-disable-next-line @typescript-eslint/naming-convention
const SCHEMA_PATTERN: HaFormSchema[] = [

  { label: 'label', name: 'label', selector: { text: {}}},
  {
    label: 'icon',
    name: 'icon',
    selector: { icon: {}},
    // eslint-disable-next-line @typescript-eslint/naming-convention
    context: { icon_entity: 'entity' }
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  { label: 'color', name: 'color', selector: { mush_color: {}}},
  { label: 'pattern', name: 'pattern', selector: { text: {}}}

];

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
  { label: 'color', name: 'color', selector: { mush_color: {}}}

];

export {
  SCHEMA_APPEARANCE,
  SCHEMA_ENTITY,
  SCHEMA_SETTINGS,
  SCHEMA_PATTERN,
  SCHEMA_PATTERN_OTHERS
};
