import { getRgbColor } from './getRgbColor';
import Color from 'color';
import { colors } from './defaultHaCardStyle';

import type { CalendarItem } from './calendarItem';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

const isColorModesArray = (modes: TrashCardConfig['color_mode'] | TrashCardConfig['color_mode'][]): modes is TrashCardConfig['color_mode'][] =>
  Boolean(modes && Array.isArray(modes));

const calculateContrast = (currentColorString: string, darkMode: boolean, parentElement?: null | HTMLElement): 'text' | 'background' => {
  const color = new Color(`rgb(${colors[currentColorString]})`);

  if (parentElement) {
    const primaryTextColor = getComputedStyle(parentElement).getPropertyValue('--primary-text-color');
    const primaryBackgroundColor = getComputedStyle(parentElement).getPropertyValue('--primary-background-color');
    const primaryConstrast = color.contrast(new Color(primaryTextColor));

    return primaryConstrast > color.contrast(new Color(primaryBackgroundColor)) ? 'text' : 'background';
  }

  return color.contrast(new Color(darkMode ? 'white' : 'black')) ? 'text' : 'text';
};

const getColoredStyle = (modes: TrashCardConfig['color_mode'] | TrashCardConfig['color_mode'][], item: CalendarItem, parentElement?: null | HTMLElement, darkMode = false) => {
  const color = item.color ?? 'disabled';

  const colorModes: TrashCardConfig['color_mode'][] = isColorModesArray(modes) ? modes : [ modes ?? 'background' ];

  const style = {};
  const rgbColor = getRgbColor(color);

  const contrast = calculateContrast(color, darkMode, parentElement);

  style['--secondary-text-color'] = `var(--primary-text-color)`;

  if (contrast === 'background') {
    style['--primary-text-color'] = `var(--primary-text-color)`;
    style['--tile-color'] = `var(--primary-background-color)`;
  }

  if (colorModes.includes('icon')) {
    style['--tile-color'] = `rgba(${rgbColor})`;
    style['--badge-color'] = `rgba(${rgbColor})`;
  }

  if (colorModes.includes('background')) {
    style['--ha-card-background'] = `rgba(${rgbColor}, 1)`;
  }

  if (colorModes.includes('badge')) {
    style['--icon-primary-color'] = `rgba(${rgbColor})`;
    style['--badge-color'] = `rgba(${rgbColor})`;
  }

  return style;
};

export {
  getColoredStyle
};
