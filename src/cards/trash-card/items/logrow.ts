import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

import type { DebuggerData } from '../../../utils/debugger';

@customElement(`${TRASH_CARD_NAME}-logrow`)
class LogRow extends LitElement {
  @state() private readonly item?: DebuggerData;

  public render () {
    if (!this.item) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const { message, data } = this.item;

    return html`
      <ha-expansion-panel outlined>
        <div slot="header" role="heading" aria-level="3" >
          ${message}
        </div>
        <code>${JSON.stringify(data, undefined, 2)}</code>
      </ha-form-expandable>`;
  }

  public static get styles () {
    return [
      css` 
        .container.expanded {
          padding: 8px;
        }
        code {
          display: block;
          margin-top: 10px;
          margin-bottom: 10px;
          white-space: pre-wrap;
          font-size: 12px;
        }
      `
    ];
  }
}

export {
  LogRow
};
