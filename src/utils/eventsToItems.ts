import type { CalendarEvent } from './calendarEvents';
import type { CalendarItem } from './calendarItem';
import type { ItemSettings } from './itemSettings';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

interface Options {
  pattern: Required<TrashCardConfig>['pattern'];
  useSummary: boolean;
}

type TrashTypes = keyof Required<Required<TrashCardConfig>['settings']>;

const getLabel = (event: CalendarEvent, settings: ItemSettings, useSummary: boolean): string => {
  if (useSummary && event.content.summary) {
    return event.content.summary;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return settings.label ?? event.content.summary ?? 'unknown';
};

const getData = <T extends TrashTypes> (event: CalendarEvent, key: T, pattern: Options['pattern'], useSummary: boolean): CalendarItem => ({
  ...event,
  label: getLabel(event, pattern[key], useSummary),
  icon: pattern[key].icon!,
  color: pattern[key].color!,
  type: pattern[key].type!
});

const typeInSettings = <T extends TrashTypes> (key: T, settings: Options['settings']): settings is Required<Options['settings']> =>
  key in settings;

const eventToItem = (event: CalendarEvent | undefined, { settings, useSummary }: Options): CalendarItem[] => {
  if (!event || !('summary' in event.content)) {
    return [];
  }

  const { content: { summary }} = event;

  const checkTypes = [ 'organic', 'paper', 'recycle', 'waste' ];

  const possibleTypes = checkTypes.
    filter(type => typeInSettings(type, settings) && settings[type].pattern && summary.includes(settings[type].pattern!));

  if (possibleTypes.length > 0) {
    return possibleTypes.map(item => getData<typeof item>(event, item, settings, useSummary));
  }

  return [ getData(event, 'others', settings, useSummary) ];
};

const eventsToItems = (events: CalendarEvent[], options: Options): CalendarItem[] => {
  const items = events.reduce<CalendarItem[]>((prev, event): CalendarItem[] => {
    const itemsFromEvents = eventToItem(event, options);

    return [ ...prev, ...itemsFromEvents ];
  }, []);

  return items.filter((item): boolean => Boolean(item.type !== 'none'));
};

export {
  eventsToItems
};
