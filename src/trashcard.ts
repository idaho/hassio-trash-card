import { version } from '../package.json';
import './utils/form/ha-selector-date-style';

// eslint-disable-next-line no-console
console.info(`%c🗑️ TrashCard ${version}`, 'background-color: #ef5350; color: #ffffff');

export { TrashCard } from './cards/trash-card/trash-card';
