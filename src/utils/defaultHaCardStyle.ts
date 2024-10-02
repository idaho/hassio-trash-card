import { css } from 'lit';

const defaultColorCss = css`
  --default-red: 244, 67, 54;
  --default-pink: 233, 30, 99;
  --default-purple: 146, 107, 199;
  --default-deep-purple: 110, 65, 171;
  --default-indigo: 63, 81, 181;
  --default-blue: 33, 150, 243;
  --default-light-blue: 3, 169, 244;
  --default-cyan: 0, 188, 212;
  --default-teal: 0, 150, 136;
  --default-green: 76, 175, 80;
  --default-light-green: 139, 195, 74;
  --default-lime: 205, 220, 57;
  --default-yellow: 255, 235, 59;
  --default-amber: 255, 193, 7;
  --default-orange: 255, 152, 0;
  --default-deep-orange: 255, 111, 34;
  --default-brown: 121, 85, 72;
  --default-light-grey: 189, 189, 189;
  --default-grey: 158, 158, 158;
  --default-dark-grey: 96, 96, 96;
  --default-blue-grey: 96, 125, 139;
  --default-black: 0, 0, 0;
  --default-white: 255, 255, 255;
  --default-disabled: 189, 189, 189;
`;

const defaultDarkColorCss = css`
  --default-disabled: 111, 111, 111;
`;

const themeColorCss = css`
  /* RGB */
  /* Standard colors */
  --rgb-red: var(--default-red);
  --rgb-pink: var(--default-pink);
  --rgb-purple: var(--default-purple);
  --rgb-deep-purple: var(--default-deep-purple);
  --rgb-indigo: var(--default-indigo);
  --rgb-blue: var(--default-blue);
  --rgb-light-blue: var(--default-light-blue);
  --rgb-cyan: var(--default-cyan);
  --rgb-teal: var(--default-teal);
  --rgb-green: var(--default-green);
  --rgb-light-green: var(--default-light-green);
  --rgb-lime: var(--default-lime);
  --rgb-yellow: var(--default-yellow);
  --rgb-amber: var(--default-amber);
  --rgb-orange: var(--default-orange);
  --rgb-deep-orange: var(--default-deep-orange);
  --rgb-brown: var(--default-brown);
  --rgb-light-grey: var(--default-light-grey);
  --rgb-grey: var(--default-grey);
  --rgb-dark-grey: var(--default-dark-grey);
  --rgb-blue-grey: var(--default-blue-grey);
  --rgb-black: var(--default-black);
  --rgb-white: var(--default-white);
  --rgb-disabled: var(--default-disabled);

`;

const themeVariables = css`
  --spacing: 10px;


  /* Chips */
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
  defaultHaCardStyle
};
