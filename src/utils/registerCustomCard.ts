import { repository } from '../../package.json';

interface RegisterCardParams {
  type: string;
  name: string;
  description: string;
}
const registerCustomCard = (params: RegisterCardParams) => {
  const windowWithCards = window as unknown as Window & {
    customCards: unknown[];
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  windowWithCards.customCards = windowWithCards.customCards || [];

  windowWithCards.customCards.push({
    ...params,
    preview: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    documentationURL: `${repository.url}/blob/main/README.md`
  });
};

export {
  registerCustomCard
};
