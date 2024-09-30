import { css } from 'lit';
import { defaultColorCss, defaultDarkColorCss } from 'lovelace-mushroom/src/utils/colors';
import { themeColorCss, themeVariables } from 'lovelace-mushroom/src/utils/theme';

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
        --main-color: rgb(var(--rgb-warning));
    }
    .not-found {
        --main-color: rgb(var(--rgb-danger));
    }
    mushroom-state-item[disabled] {
        cursor: initial;
    }
`;

export {
  defaultHaCardStyle
};
