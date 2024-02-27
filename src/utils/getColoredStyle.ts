import { getRgbColor } from './getRgbColor';

import type { CalendarItem } from './calendarItem';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

const getColoredStyle = (mode: TrashCardConfig['color_mode'], item: CalendarItem) => {
  const color = item.color ?? 'disabled';

  const style = {};
  const rgbColor = getRgbColor(color);

  if (mode === 'icon') {
    style['--trash-card-icon-color'] = `rgba(${rgbColor})`;
  } else {
    style['--trash-card-background'] = `rgba(${rgbColor}, .7)`;
  }

  return style;
};

export {
  getColoredStyle
};
