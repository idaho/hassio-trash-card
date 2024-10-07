import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';

import '../elements/title';
import '../items/logrow';

import type { DebuggerData } from '../../../utils/debugger';

@customElement(`${TRASH_CARD_NAME}-debug-container`)
class Debug extends LitElement {
  @state() private readonly logs?: DebuggerData[];

  protected copyDebugLogToClipboard (ev: CustomEvent): void {
    ev.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(JSON.stringify(this.logs ?? {})).
      then(() => {
        // eslint-disable-next-line no-alert
        alert('Debug data copied to clipboard');
      });
  }

  public render () {
    return html`<ha-card class="debug-container">
        <trash-card-title>
          <span slot="title">DEBUG LOG</span>
          <ha-icon-button
            .label="copy debug log to clipboard"
            class="copy-to-clipboard-icon"
            slot="title-icon"
            @click=${this.copyDebugLogToClipboard.bind(this)}
          >
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </ha-icon-button>
        </trash-card-title>

        <div class="content">
          ${this.logs?.map(item => html`
            <trash-card-logrow
              .item=${item}
            ></trash-card-logrow>
            `)}
        </div>
    </ha-card>`;
  }

  public static get styles () {
    return [
      defaultHaCardStyle,
      css`
        .debug-container {
          margin-bottom: 5px;
          border: rgb(var(--rgb-pink)) dotted 1px;
          opacity: 0.7;
        }
      `
    ];
  }
}

export {
  Debug
};
