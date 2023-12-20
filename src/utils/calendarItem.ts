import type { CalendarEvent } from './calendarEvents';

interface ValidCalendarItem extends CalendarEvent {
  label: string;
  color?: string;
  icon?: string;
  type: string;
}

type CalendarItem = {
  type: 'none';
} | ValidCalendarItem;

export type {
  CalendarItem,
  ValidCalendarItem
};
