import { getRgbColor } from './getRgbColor';

import type { CalendarItem } from './calendarItem';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

const isColorModesArray = (modes: TrashCardConfig['color_mode'] | TrashCardConfig['color_mode'][]): modes is TrashCardConfig['color_mode'][] =>
  Boolean(modes && Array.isArray(modes));

const getColoredStyle = (modes: TrashCardConfig['color_mode'] | TrashCardConfig['color_mode'][], item: CalendarItem) => {
  const color = item.color ?? 'disabled';

  const colorModes: TrashCardConfig['color_mode'][] = isColorModesArray(modes) ? modes : [ modes ?? 'background' ];

  const style = {};
  const rgbColor = getRgbColor(color);

  if (colorModes.includes('icon')) {
    style['--trash-card-icon-color'] = `rgba(${rgbColor})`;
  }

  if (colorModes.includes('background')) {
    style['--trash-card-background'] = `rgba(${rgbColor}, .7)`;
  }

  return style;
};

export {
  getColoredStyle
};
