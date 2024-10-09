import type { CalendarEvent } from './calendarEvents';
import type { ItemSettings } from './itemSettings';

const filterEventByPatterns = ({ pattern, pattern_exact }: ItemSettings, { content: { summary }}: CalendarEvent) => {
  if (pattern_exact) {
    return pattern && summary.toLowerCase() === pattern.toLowerCase();
  }

  return pattern && summary.toLowerCase().includes(pattern.toLowerCase());
};

export {
  filterEventByPatterns
};
