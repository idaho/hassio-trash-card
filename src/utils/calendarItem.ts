import type { CalendarEvent } from './calendarEvents';

interface CalendarItem extends CalendarEvent {
  label: string;
  color?: string;
  icon?: string;
  type: `custom-${number}` | 'organic' | 'paper' | 'recycle' | 'waste' | 'others';
}

export type {
  CalendarItem
};
