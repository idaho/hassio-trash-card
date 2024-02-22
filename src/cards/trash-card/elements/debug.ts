import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';

import type { Debugger } from '../../../utils/debugger';

@customElement(`${TRASH_CARD_NAME}-debug-card`)
class Debug extends LitElement {
  @state() private readonly debugger?: Debugger;

  protected copyDebugLogToClipboard (ev: CustomEvent): void {
    ev.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(JSON.stringify(this.debugger?.getLogs() ?? {})).
      then(() => {
        // eslint-disable-next-line no-alert
        alert('Debug data copied to clipboard');
      });
  }

  public render () {
    if (!this.debugger) {
      return nothing;
    }

    return html`<ha-card class="debug-container">
      <div>
        <div class="title">
          <h3>DEBUG LOG</h3>
          <ha-icon-button
              .label="copy debug log to clipboard"
              class="copy-to-clipboard-icon"
              @click=${this.copyDebugLogToClipboard.bind(this)}
              >
              <ha-icon icon="mdi:content-copy"></ha-icon>
            </ha-icon-button>
        </div>
        <div class="debug-content">
          ${this.debugger.getLogs().map(({ message, data }) => html`
            <ha-expansion-panel class="debug-panel" outlined>
              <div slot="header" role="heading" aria-level="3" class="header" >
                ${message}
              </div>
              <div class="content">
                <code>${JSON.stringify(data, undefined, 2)}</code>
              </div>
            </ha-form-expandable>
            `)}
        </div>
      </div>
    </ha-card>`;
  }

  public static get styles () {
    return [
      defaultHaCardStyle,
      css`
        .debug-container {
          word-wrap: break-word;
          word-break: break-all;
          margin-bottom: 5px;
          border: rgb(var(--rgb-pink)) dotted 1px;
          opacity: 0.7;
        }
        .debug-container .title {
          display: grid;
          color: rgb(var(--rgb-pink));
          grid-template-columns: auto  50px
        }
        .debug-container .debug-content {
          overflow-y: scroll;
        }
        .debug-container .debug-content code {
          margin-top: 10px;
          margin-bottom: 10px;
          white-space: pre-wrap;
          font-size: 12px;
        }
        .debug-panel .header {
          padding-left: 8px;
        }
        .debug-panel .content {
          padding: 8px;
        }
      `
    ];
  }
}

export {
  Debug
};
