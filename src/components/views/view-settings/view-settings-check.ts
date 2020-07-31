import { html, css, LitElement, property, customElement } from 'lit-element';
import '@vaadin/vaadin-button';

import { api, componentEvent } from '../../shared-functions.js';
import { data, CheckItem } from './view-settings-check-data.js';
import '../../card-default.js';
import '../../component-status-item.js';

@customElement('view-settings-check')
export class ViewSettingsCheck extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
    }

    vaadin-button {
      cursor: pointer;
    }

    #list {
      display: flex;
      flex-wrap: wrap;
    }
  `;

  @property({ type: Array }) checks: Array<CheckItem> = data;
  @property({ type: Boolean }) loading = false;

  protected async resetChecksStatus() {
    for (const index in this.checks) {
      this.checks[index].status = 'loading';
    }
  }

  protected async handleCheck(route: string) {
    const response = await api(route);
    let status;
    if (response.success) {
      status = 'success';
    } else {
      status = 'error';
      componentEvent(this, 'show-notifications', {
        theme: 'error',
        text: `Компонент "${response.message}" не прошел проверку`,
      });
    }
    for (const index in this.checks) {
      const check = this.checks[index];
      if (check.route === route) check.status = status;
    }
    this.requestUpdate();
  }

  async check() {
    this.loading = true;
    await this.resetChecksStatus();
    const promises = [];
    for (const index in this.checks) {
      const check = data[index];
      promises.push(this.handleCheck(check.route));
    }
    await Promise.all(promises);
    this.loading = false;
  }

  render() {
    return html`
      <card-default header="Проверка компонентов" ?loading="${this.loading}">
        <div id="container" slot="content">
          <div id="list">
            ${this.checks.map(
              check =>
                html`
                  <component-status-item
                    .data="${{
                      text: check.text,
                      description: check.description,
                      status: check.status,
                      icon: check.icon,
                      errorMessage: check.errorMessage,
                    }}"
                  ></component-status-item>
                `
            )}
          </div>
        </div>
        <vaadin-button
          slot="actions"
          @click="${this.check}"
          ?disabled="${this.loading}"
        >
          Проверить</vaadin-button
        >
      </card-default>
    `;
  }
}
