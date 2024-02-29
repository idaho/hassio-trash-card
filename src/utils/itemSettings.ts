interface ItemSettings {
  label?: string;
  color?: string;
  pattern?: string;
  icon?: string;
  type: 'custom' | 'organic' | 'paper' | 'recycle' | 'waste' | 'others';
  picutre?: string;
}

export type {
  ItemSettings
};
