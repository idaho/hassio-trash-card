import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

@customElement(`${TRASH_CARD_NAME}-title`)
class Debug extends LitElement {
  // eslint-disable-next-line class-methods-use-this
  public render () {
    return html`
          <div class="title">
            <h3><slot name="title"></slot></h3>
            <div><slot name="title-icon"></slot></div>
          </div>`;
  }

  public static get styles () {
    return [
      css`
      .title {
          display: grid;
          color: rgb(var(--rgb-pink));
          grid-template-columns: auto  50px
        }
      `
    ];
  }
}

export {
  Debug
};
