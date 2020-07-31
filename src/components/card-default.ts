import { html, css, LitElement, property, customElement } from 'lit-element';
import '@vaadin/vaadin-progress-bar';

@customElement('card-default')
export class CardDefault extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
    }

    h3 {
      margin-bottom: 0 0 24px 0;
      color: var(--lumo-secondary-text-color);
      font-size: var(--lumo-font-size-s);
    }

    vaadin-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
    }

    vaadin-progress-bar::part(bar) {
      border-radius: 0;
    }

    #container {
      position: relative;
      box-sizing: border-box;
      box-shadow: var(--lumo-box-shadow-s);
      padding: var(--lumo-space-l);
      border-radius: var(--lumo-border-radius);
      overflow: hidden;
      background: var(--lumo-tint-5pct);
    }

    #actions {
      display: flex;
      justify-content: flex-end;
    }
  `;

  @property({ type: String }) header = '';
  @property({ type: Boolean }) loading = false;

  render() {
    return html`
      <h3>${this.header}</h3>
      <div id="container">
        ${this.loading
          ? html`<vaadin-progress-bar
              indeterminate
              value="0"
            ></vaadin-progress-bar>`
          : null}
        <slot name="description"></slot>
        <slot name="content"></slot>
        <div id="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}
