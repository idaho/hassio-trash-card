/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undef */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HASSDomEvents {}
}

type ValidHassDomEvent = keyof HASSDomEvents;

// eslint-disable-next-line @typescript-eslint/naming-convention
const fireEvent = <HassEvent extends ValidHassDomEvent>(
  node: HTMLElement | Window,
  type: HassEvent,
  detail?: HASSDomEvents[HassEvent],
  options?: {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
  }
) => {
  // eslint-disable-next-line no-param-reassign
  options = options ?? {};

  // @ts-expect-error 2322
  // eslint-disable-next-line no-param-reassign
  detail = !detail ? {} : detail;

  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed
  });

  (event as any).detail = detail;
  node.dispatchEvent(event);

  return event;
};

export {
  fireEvent
};
