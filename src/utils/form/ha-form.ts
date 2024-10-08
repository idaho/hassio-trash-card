import type { LitElement } from 'lit';

interface ColorUiSelector {
  // eslint-disable-next-line @typescript-eslint/ban-types
  ui_color: {};
}

interface BooleanSelector {
  // eslint-disable-next-line @typescript-eslint/ban-types
  boolean: {};
}
interface TimeSelector {
  // eslint-disable-next-line @typescript-eslint/ban-types
  time: {};
}
interface NumberSelector {
  number: {
    min?: number;
    max?: number;
    step?: number;
    mode?: 'box' | 'slider';
    unit_of_measurement?: string;
  };
}

interface StringSelector {
  text: {
    multiline?: boolean;
    type?:
    | 'number'
    | 'text'
    | 'search'
    | 'tel'
    | 'url'
    | 'email'
    | 'password'
    | 'date'
    | 'month'
    | 'week'
    | 'time'
    | 'datetime-local'
    | 'color';
    suffix?: string;
  };
}

interface SelectSelector {
  select: {
    multiple?: boolean;
    custom_value?: boolean;
    mode?: 'list' | 'dropdown';
    options: string[] | {
      value: string;
      label: string;
    }[];
  };
}
interface EntitySelector {
  entity: {
    integration?: string;
    domain?: string | string[];
    device_class?: string;
    multiple?: boolean;
    include_entities?: string[];
    exclude_entities?: string[];
  };
}

type Selector =
  EntitySelector |
  StringSelector |
  TimeSelector |
  NumberSelector |
  SelectSelector |
  BooleanSelector |
  ColorUiSelector;

interface HaDurationData {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

 type HaFormSchema =
    | HaFormConstantSchema
    | HaFormStringSchema
    | HaFormIntegerSchema
    | HaFormFloatSchema
    | HaFormBooleanSchema
    | HaFormSelectSchema
    | HaFormMultiSelectSchema
    | HaFormTimeSchema
    | HaFormSelector
    | HaFormGridSchema
    | HaFormExpandableSchema
    | HaFormPatternSchema;

interface HaFormBaseSchema {
  name: string;

  // This value is applied if no data is submitted for this field
  default?: HaFormData;
  required?: boolean;
  helper?: string;
  description?: {
    suffix?: string;

    // This value will be set initially when form is loaded
    // eslint-disable-next-line @typescript-eslint/naming-convention
    suggested_value?: HaFormData;
  };
  label?: string;
  context?: Record<string, string>;
}

interface HaFormGridSchema extends HaFormBaseSchema {
  type: 'grid';
  name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  column_min_width?: string;
  schema: HaFormSchema[];
}

interface HaFormExpandableSchema extends HaFormBaseSchema {
  type: 'expandable';
  title: string;
  icon?: string;
  schema: HaFormSchema[];
}

interface HaFormSelector extends HaFormBaseSchema {
  type?: never;
  selector: Selector;
}

interface HaFormConstantSchema extends HaFormBaseSchema {
  type: 'constant';
  value?: string;
}

interface HaFormIntegerSchema extends HaFormBaseSchema {
  type: 'integer';
  default?: HaFormIntegerData;
  valueMin?: number;
  valueMax?: number;
}

interface HaFormSelectSchema extends HaFormBaseSchema {
  type: 'select';
  options: [string, string][];
}

interface HaFormMultiSelectSchema extends HaFormBaseSchema {
  type: 'multi_select';
  options: Record<string, string> | string[] | [string, string][];
}

interface HaFormFloatSchema extends HaFormBaseSchema {
  type: 'float';
}

interface HaFormPatternSchema extends HaFormBaseSchema {
  type: 'pattern';
}

interface HaFormStringSchema extends HaFormBaseSchema {
  type: 'string';
  format?: string;
}

interface HaFormBooleanSchema extends HaFormBaseSchema {
  type: 'boolean';
}

interface HaFormTimeSchema extends HaFormBaseSchema {
  type: 'positive_time_period_dict';
}

 type HaFormDataContainer = Record<string, HaFormData>;

 type HaFormData =
    | HaFormStringData
    | HaFormIntegerData
    | HaFormFloatData
    | HaFormBooleanData
    | HaFormSelectData
    | HaFormMultiSelectData
    | HaFormTimeData;

 type HaFormStringData = string;
 type HaFormIntegerData = number;
 type HaFormFloatData = number;
 type HaFormBooleanData = boolean;
 type HaFormSelectData = string;
 type HaFormMultiSelectData = string[];
 type HaFormTimeData = HaDurationData;

interface HaFormElement extends LitElement {
  schema: HaFormSchema | HaFormSchema[];
  data?: HaFormDataContainer | HaFormData;
  label?: string;
}

export type {
  ColorUiSelector,
  HaFormSchema,
  HaFormBaseSchema,
  HaFormGridSchema,
  HaFormExpandableSchema,
  HaFormSelector,
  HaFormConstantSchema,
  HaFormIntegerSchema,
  HaFormSelectSchema,
  HaFormMultiSelectSchema,
  HaFormFloatSchema,
  HaFormPatternSchema,
  HaFormStringSchema,
  HaFormBooleanSchema,
  HaFormTimeSchema,
  HaFormDataContainer,
  HaFormData,
  HaFormStringData,
  HaFormIntegerData,
  HaFormFloatData,
  HaFormBooleanData,
  HaFormSelectData,
  HaFormMultiSelectData,
  HaFormTimeData,
  HaFormElement
};
