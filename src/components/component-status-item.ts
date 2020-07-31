import { html, css, LitElement, property, customElement } from 'lit-element';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import '@polymer/iron-iconset-svg';
import '@polymer/iron-icon';

@customElement('component-status-item')
export class ComponentStatusItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
      contain: content;
      width: 50%;
    }

    iron-icon {
      min-width: 32px;
      min-height: 32px;
      color: var(--lumo-disabled-text-color);
      align-self: flex-start;
      margin-top: 8px;
    }

    vaadin-progress-bar {
      margin: 0;
      height: 3px;
    }

    #container {
      display: flex;
      align-items: center;
      margin: var(--lumo-space-tall-m);
    }

    #text {
      margin-left: var(--lumo-space-m);
    }

    .success {
      color: var(--lumo-success-color);
    }

    .error {
      color: var(--lumo-error-color);
    }

    #title {
      font-size: var(--lumo-font-size-m);
      line-height: var(--lumo-line-height-m);
      color: var(--lumo-header-text-color);
      margin: var(--lumo-space-wide-m) 0;
    }

    #description,
    #error {
      font-size: var(--lumo-font-size-s);
      line-height: var(--lumo-line-height-s);
      padding: var(--lumo-space-wide-m);
    }

    #description {
      color: var(--lumo-secondary-text-color);
    }

    #error {
      color: var(--lumo-error-text-color);
      background-color: var(--lumo-error-color-10pct);
      font-size: var(--lumo-font-size-s);
      font-weight: 500;
    }

    @media (max-width: 650px) {
      :host {
        width: 100%;
      }

      iron-icon {
        min-width: 24px;
        min-height: 24px;
        margin-top: 12px;
      }
    }
  `;

  @property({ type: Object }) data = {
    text: '',
    status: '',
    description: '',
    icon: '',
    errorMessage: '',
  };

  render() {
    return html`
      <iron-iconset-svg name="component-status-item-icons">
        <svg>
          <defs>
            ${unsafeSVG(this.data.icon)}
          </defs>
        </svg>
      </iron-iconset-svg>
      <div id="container">
        <iron-icon
          class="${this.data.status}"
          icon="component-status-item-icons:icon"
        ></iron-icon>
        <div id="text">
          <div id="title"><strong>${this.data.text}</strong></div>
          <div id="description">${this.data.description}</div>
          ${this.data.status === 'error'
            ? html`<div id="error">${this.data.errorMessage}</div>`
            : null}
        </div>
      </div>
    `;
  }
}
