import { html, css, LitElement, property, customElement } from 'lit-element';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-text-field/vaadin-text-area';

import '../../card-default.js';
import '../../component-status-item.js';
import { api, componentEvent } from '../../shared-functions.js';
import { data, DeleteItem } from './view-settings-delete-data.js';

@customElement('view-settings-delete')
export class ViewSettingsDelete extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
    }

    vaadin-button {
      margin: 0;
      cursor: pointer;
    }

    h3 {
      text-transform: uppercase;
      text-align: center;
    }

    #list {
      display: flex;
      flex-wrap: wrap;
    }

    #bottom-actions {
      display: flex;
      justify-content: center;
      border-top: 1px solid var(--lumo-disabled-text-color);
      margin-top: calc(2 * var(--lumo-space-l));
      padding: var(--lumo-space-l);
    }

    #bottom-actions vaadin-button {
      color: var(--lumo-secondary-text-color);
    }

    #actions {
      display: flex;
      justify-content: flex-end;
    }

    #back {
      margin-right: var(--lumo-space-s);
    }

    #delete-complete {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: var(--lumo-space-l);
    }

    [hidden],
    #delete-complete[hidden],
    #actions[hidden] {
      display: none;
    }
  `;

  @property({ type: Array }) checks: Array<DeleteItem> = data;
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) deleteMode = false;
  @property({ type: Boolean }) deleteComplete = false;

  protected async handleCheck(route: string) {
    const response = await api(route);
    let status;
    response.success ? (status = 'success') : (status = 'error');
    for (const index in this.checks) {
      const check = this.checks[index];
      if (check.route === route) check.status = status;
    }
    this.requestUpdate();
  }

  protected async _delete() {
    this.loading = true;
    const promises = [];
    for (const index in this.checks) {
      const check = data[index];
      promises.push(this.handleCheck(check.route));
    }
    await Promise.all(promises);
    componentEvent(this, 'show-notification', {
      theme: 'success',
      text: 'Компоненты удалены',
    });
    this.deleteComplete = true;
    this.loading = false;
  }

  protected _toggleMode() {
    componentEvent(this, 'delete-mode', { deleteMode: !this.deleteMode });
    this.deleteMode = !this.deleteMode;
  }

  render() {
    return html`
      <iron-iconset-svg size="24" name="view-settings-delete-icons">
        <svg>
          <defs>
            <g id="delete">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </g>
            <g id="back-icon">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z"
              />
            </g>
          </defs>
        </svg>
      </iron-iconset-svg>
      ${this.deleteMode
        ? html`<card-default
            header="Удаление webtutor-push-notifications"
            ?loading="${this.loading}"
          >
            <div id="container" slot="content">
              <div id="actions" ?hidden="${this.deleteComplete}">
                <vaadin-button
                  slot="actions"
                  id="back"
                  @click="${this._toggleMode}"
                  ?disabled="${this.loading}"
                  ><iron-icon
                    icon="view-settings-delete-icons:back-icon"
                    slot="prefix"
                  ></iron-icon>
                  Назад</vaadin-button
                >
                <vaadin-button
                  theme="error primary"
                  slot="actions"
                  @click="${this._delete}"
                  ?disabled="${this.loading}"
                  ><iron-icon
                    icon="view-settings-delete-icons:delete"
                    slot="prefix"
                  ></iron-icon>
                  Удалить</vaadin-button
                >
              </div>
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
              <div id="delete-complete" ?hidden="${!this.deleteComplete}">
                <p>Для удаление файлов в командной строке введите:</p>
                <vaadin-text-area
                    .value="${`cd C:\\Program Files\\WebSoft\\WebTutorServer\\wt\\web
npm uninstall @maksimyurkov/webtutor-push-notifications --save`}"
                  ></vaadin-text-area>
            </div>
          </card-default>`
        : html`<div id="bottom-actions">
            <vaadin-button
              slot="actions"
              theme="tertiary"
              @click="${this._toggleMode}"
              ><iron-icon
                icon="view-settings-delete-icons:delete"
                slot="prefix"
              ></iron-icon>
              Удалить</vaadin-button
            >
          </div>`}
    `;
  }
}
