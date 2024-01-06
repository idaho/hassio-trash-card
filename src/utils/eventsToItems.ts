import type { CalendarEvent } from './calendarEvents';
import type { CalendarItem } from './calendarItem';
import type { ItemSettings } from './itemSettings';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

interface Options {
  settings: Required<TrashCardConfig>['settings'];
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

const getData = <T extends TrashTypes> (event: CalendarEvent, key: T, settings: Omit<Partial<Options['settings']>, T> & Pick<Required<Options['settings']>, T>, useSummary: boolean): CalendarItem => ({
  ...event,
  label: getLabel(event, settings[key], useSummary),
  icon: settings[key].icon!,
  color: settings[key].color!,
  type: key
});

const typeInSettings = <T extends TrashTypes> (key: T, settings: Options['settings']): settings is Required<Options['settings']> =>
  key in settings;

const eventToItem = (event: CalendarEvent | undefined, { settings, useSummary }: Options): CalendarItem => {
  if (!event || !('summary' in event.content)) {
    return {
      ...event,
      type: 'none'
    };
  }

  const { content: { summary }} = event;

  const checkTypes: TrashTypes[] = [ 'organic', 'paper', 'recycle', 'waste' ];

  const possibleType = checkTypes.
    find((type: TrashTypes) => typeInSettings(type, settings) && settings[type].pattern && summary.includes(settings[type].pattern!));

  if (possibleType && possibleType in settings) {
    // @ts-expect-error TS2345
    return getData<typeof possibleType>(event, possibleType, settings, useSummary);
  }

  // @ts-expect-error TS2345
  return getData(event, 'others', settings, useSummary);
};

const eventsToItems = (events: CalendarEvent[], options: Options): CalendarItem[] =>
  events.map(event => eventToItem(event, options));

export {
  eventsToItems
};
