import type { CalendarEvent } from './calendarEvents';

interface CalendarItem extends CalendarEvent {
  label: string;
  color?: string;
  icon?: string;
  type: string;
}

export type {
  CalendarItem
};
