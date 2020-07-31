import {
  html,
  css,
  LitElement,
  property,
  customElement,
  query,
} from 'lit-element';
import '@vaadin/vaadin-tabs/vaadin-tabs';
import './view-settings-check.js';
const ViewSettingsCheck = customElements.get('view-settings-check');

import './view-settings-firebase.js';
import './view-settings-delete.js';

@customElement('view-settings')
export class ViewSettings extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
    }

    :host > * {
      margin-top: 32px;
    }

    [hidden] {
      display: none;
    }
  `;

  @property({ type: Boolean }) installMode = true;
  @property({ type: Boolean }) deleteMode = false;

  @query('view-settings-check')
  checkElement?: typeof ViewSettingsCheck;

  firstUpdated() {
    this.addEventListener('config-exists', () => {
      this.installMode = false;
    });
    this.addEventListener('delete-mode', (event: Event) => {
      const detail = (event as CustomEvent).detail;
      this.deleteMode = detail.deleteMode;
    });
    this.addEventListener('config-updated', e => {
      e.stopPropagation();
      if (this.checkElement) this.checkElement.check();
    });
  }

  render() {
    return html`
      <view-settings-firebase
        ?hidden="${this.deleteMode}"
      ></view-settings-firebase>
      <view-settings-check
        ?hidden="${this.deleteMode || this.installMode}"
      ></view-settings-check>
      <view-settings-delete
        ?hidden="${this.installMode}"
      ></view-settings-delete>
    `;
  }
}
