import {
  html,
  css,
  LitElement,
  property,
  customElement,
  query,
} from 'lit-element';
import { render } from 'lit-html';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import { GridElement } from '@vaadin/vaadin-grid/src/vaadin-grid.js';
import { GridBodyRenderer } from '@vaadin/vaadin-grid/@types/interfaces.js';
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
const TextFieldElement = customElements.get('vaadin-text-field');
import '@vaadin/vaadin-button/vaadin-button';
import '@polymer/iron-iconset-svg';
import '@polymer/iron-icon';

import { api, componentEvent, copy } from '../../shared-functions.js';
import '../../not-found-placeholder.js';
import '../../card-default.js';

interface KeyItem {
  id: string;
  name: string;
  key: string;
}

@customElement('view-keys')
export class ViewTest extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
    }

    :host > * {
      margin-top: 32px;
    }

    vaadin-button {
      cursor: pointer;
    }

    vaadin-text-field {
      padding: 0;
    }

    vaadin-grid,
    #grid-container {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    #actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: var(--lumo-space-l);
    }

    #actions vaadin-button {
      margin: 0 0 0 var(--lumo-space-m);
    }

    [icon='view-keys-icons:delete'] {
      color: var(--lumo-error-color);
    }

    .key {
      display: flex;
      align-items: center;
    }

    .key vaadin-button {
      margin-right: var(--lumo-space-m);
    }

    @media (max-width: 430px) {
      vaadin-text-field,
      vaadin-button {
        width: 100%;
      }

      #actions vaadin-button {
        margin: var(--lumo-space-m) 0 0 0;
      }
    }
  `;

  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) ready = false;
  @property({ type: Array }) items: Array<KeyItem> = [];

  @query('vaadin-grid')
  grid?: GridElement;

  @query('vaadin-text-field')
  input?: typeof TextFieldElement;

  firstUpdated() {
    this.getItems();
  }

  protected async getItems() {
    this.loading = true;
    const response = await api('/keys');
    if (response.success) this.items = response.keys;
    this.loading = false;
    this.ready = true;
  }

  protected async add() {
    this.loading = true;
    const value = this.input?.value;
    const response = await api(
      '/keys/add',
      JSON.stringify({
        name: value,
      })
    );
    if (response.success) {
      componentEvent(this, 'show-notification', {
        theme: 'success',
        text: `Ключ добавлен`,
      });
      this.input.value = '';
    } else {
      componentEvent(this, 'show-notification', {
        theme: 'error',
        text: `Не удалось добавить ключ`,
      });
    }
    await this.getItems();
  }

  protected async delete(id: string) {
    this.loading = true;
    const response = await api(
      '/keys/delete',
      JSON.stringify({
        id: id,
      })
    );
    if (response.success) {
      componentEvent(this, 'show-notification', {
        theme: 'success',
        text: `Ключ удален`,
      });
    } else {
      componentEvent(this, 'show-notification', {
        theme: 'error',
        text: `Не удалось удалить ключ`,
      });
    }
    await this.getItems();
  }

  protected keyRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: KeyItem = value as KeyItem;
    const key: string = item.key;
    render(
      html`<div class="key">
        <vaadin-button
          theme="icon small"
          @click="${(e: CustomEvent) => {
            e.stopPropagation();
            copy(key, this);
          }}"
          ><iron-icon icon="view-keys-icons:copy"></iron-icon
        ></vaadin-button>
        <div>${key.slice(0, 25)}...</div>
      </div>`,
      root
    );
  };

  protected actionRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: KeyItem = value as KeyItem;
    const id: string = item.id;
    render(
      html`<vaadin-button
        theme="icon small"
        @click="${() => {
          this.delete(id);
        }}"
        ><iron-icon icon="view-keys-icons:delete"></iron-icon
      ></vaadin-button>`,
      root
    );
  };

  render() {
    return html`
      <iron-iconset-svg size="24" name="view-keys-icons">
        <svg>
          <defs>
            <g id="copy">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </g>
            <g id="delete">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </g>
          </defs>
        </svg>
      </iron-iconset-svg>
      <card-default header="Управление ключами" ?loading="${this.loading}">
        <div id="content" slot="content">
          <div id="grid-container">
            ${this.ready
              ? html`<div id="actions">
                  <vaadin-text-field
                    placeholder="Название ключа"
                  ></vaadin-text-field>
                  <vaadin-button
                    theme="primary"
                    @click="${this.add}"
                    ?disabled="${this.loading}"
                    >Добавить</vaadin-button
                  >
                </div>`
              : null}
            ${this.ready && this.items.length !== 0
              ? html`<vaadin-grid theme="column-borders" .items="${this.items}">
                  <vaadin-grid-sort-column
                    path="name"
                    header="Название"
                    width="450px"
                    flex-grow="0"
                  ></vaadin-grid-sort-column>
                  <vaadin-grid-column
                    path="key"
                    header="Ключ"
                    width="320px"
                    flex-grow="0"
                    .renderer="${this.keyRenderer}"
                  ></vaadin-grid-column>
                  <vaadin-grid-column
                    path="id"
                    header=""
                    width="70px"
                    flex-grow="0"
                    .renderer="${this.actionRenderer}"
                  ></vaadin-grid-column>
                </vaadin-grid>`
              : null}
            ${this.ready && this.items.length === 0
              ? html`<not-found-placeholder
                  text="Ключи не найдены"
                ></not-found-placeholder>`
              : null}
          </div>
        </div>
      </card-default>
    `;
  }
}
