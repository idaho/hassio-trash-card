import { css, unsafeCSS } from 'lit';

const colors = {
  red: '244, 67, 54',
  pink: '233, 30, 99',
  purple: '146, 107, 199',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'deep-purple': '110, 65, 171',
  indigo: '63, 81, 181',
  blue: '33, 150, 243',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'light-blue': '3, 169, 244',
  cyan: '0, 188, 212',
  teal: '0, 150, 136',
  green: '76, 175, 80',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'light-green': '139, 195, 74',
  lime: '205, 220, 57',
  yellow: '255, 235, 59',
  amber: '255, 193, 7',
  orange: '255, 152, 0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'deep-orange': '255, 111, 34',
  brown: '121, 85, 72',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'light-grey': '189, 189, 189',
  grey: '158, 158, 158',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'dark-grey': '96, 96, 96',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'blue-grey': '96, 125, 139',
  black: '0, 0, 0',
  white: '255, 255, 255',
  disabled: '189, 189, 189'
};

const defaultColorCssMap = Object.entries(colors).
  map(([ color, rgb ]) => `--default-${color}: ${rgb};`);

const defaultColorCss = css`
    ${unsafeCSS(defaultColorCssMap.join('\n'))}
`;

const defaultDarkColorCss = css`
  --default-disabled: 111, 111, 111;
`;

const themeColorCssMap = Object.entries(colors).
  map(([ color ]) => `--rgb-${color}: var(--default-${color});`);

const themeColorCss = css`
      ${unsafeCSS(themeColorCssMap.join('\n'))}
`;

const themeVariables = css`
  --spacing: 10px;
  --chip-spacing: 8px;
`;
const defaultHaCardStyle = css`
    :host {
        ${defaultColorCss}
    }
    :host([dark-mode]) {
        ${defaultDarkColorCss}
    }
    :host {
        ${themeColorCss}
        ${themeVariables}
    }
    ha-card {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: var(--layout-align);
        height: auto;
    }
    ha-card.fill-container {
        height: 100%;
    }
    .actions {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
    }
    .actions::-webkit-scrollbar {
        background: transparent; /* Chrome/Safari/Webkit */
        height: 0px;
    }
    .actions *:not(:last-child) {
        margin-right: var(--spacing);
    }
    .actions[rtl] *:not(:last-child) {
        margin-right: initial;
        margin-left: var(--spacing);
    }
    .unavailable {
        --main-color: rgb(var(--rgb-warning);
    }
    .not-found {
        --main-color: rgb(var(--rgb-danger);
    }
`;

export {
  colors,
  defaultHaCardStyle
};
