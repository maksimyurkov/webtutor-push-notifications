import {
  html,
  css,
  LitElement,
  property,
  customElement,
  query,
  queryAll,
} from 'lit-element';
import { render } from 'lit-html';
import '@vaadin/vaadin-grid';
import { GridElement } from '@vaadin/vaadin-grid/src/vaadin-grid.js';
import { GridBodyRenderer } from '@vaadin/vaadin-grid/@types/interfaces.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-text-field/vaadin-text-area.js';
import '@vaadin/vaadin-button/vaadin-button';
const ButtonElement = customElements.get('vaadin-button');
import '@vaadin/vaadin-checkbox/vaadin-checkbox';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
const ContextMenuElement = customElements.get('vaadin-context-menu');
import '@polymer/iron-iconset-svg';
import '@polymer/iron-icon';

import '../../not-found-placeholder.js';
import '../../card-default.js';
import { api, componentEvent, copy } from '../../shared-functions.js';

interface QueueItem {
  id: string;
  status: string;
  created: string;
  updated: string;
  instanceId: string;
  userId: number;
  fullname: string;
  name: string;
  browser: string;
  device: string;
  type: string;
  manufacturer: string;
  os: string;
  notification: string;
}

@customElement('view-queue')
export class ViewQueue extends LitElement {
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

    vaadin-text-area {
      width: 100%;
      position: relative;
      margin: var(--lumo-space-s) 0;
    }

    #actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: var(--lumo-space-l);
    }

    #actions #buttons {
      display: flex;
    }

    #actions #buttons vaadin-button {
      margin: 0 0 0 var(--lumo-space-m);
    }

    .copy {
      display: flex;
      align-items: center;
    }

    .copy vaadin-button {
      margin-right: var(--lumo-space-m);
    }

    [icon='view-queue-icons:success'] {
      color: var(--lumo-success-color);
    }

    [icon='view-queue-icons:waiting'] {
      color: var(--lumo-tertiary-text-color);
    }

    [icon='view-queue-icons:error'] {
      color: var(--lumo-error-color);
    }

    [hidden] {
      display: none;
    }

    @media (max-width: 400px) {
      #actions #buttons {
        width: 100%;
        margin-top: var(--lumo-space-m);
        justify-content: space-between;
      }

      #actions #buttons vaadin-button {
        margin: 0;
      }
    }
  `;

  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) ready = false;
  @property({ type: Array }) items: Array<QueueItem> = [];

  @query('vaadin-grid')
  grid?: GridElement;

  @query('vaadin-context-menu')
  contextmenu?: typeof ContextMenuElement;

  @query('#menu')
  menuButton?: typeof ButtonElement;

  @queryAll(
    'vaadin-grid-column,vaadin-grid-filter-column,vaadin-grid-sort-column'
  )
  columns?: Array<HTMLElement>;

  constructor() {
    super();
    this.getItems();
  }

  firstUpdated() {
    this.addListenerOpenDetailsOnRowClick();
    this.initContextMenu();
  }

  protected addListenerOpenDetailsOnRowClick() {
    if (this.grid) {
      const grid = this.grid;
      grid.addEventListener('click', e => {
        const eventContext = grid.getEventContext(e);
        if (eventContext && 'item' in eventContext) {
          if (eventContext.section === 'details') return;
          const item = eventContext.item;
          if (grid.detailsOpenedItems) {
            if (
              JSON.stringify(grid.detailsOpenedItems) === JSON.stringify([item])
            ) {
              grid.detailsOpenedItems = [];
            } else {
              grid.detailsOpenedItems = [item];
            }
          }
        }
      });
    }
  }

  protected initContextMenu() {
    this.contextmenu.listenOn = this.menuButton;
    this.contextmenu.openOn = 'click';
    const columns = this.columns;
    if (columns === undefined) return;
    this.contextmenu.renderer = function (root: HTMLElement) {
      root.innerHTML = '';
      columns.forEach(function (column: HTMLElement) {
        const checkbox = window.document.createElement('vaadin-checkbox');
        checkbox.style.display = 'block';
        checkbox.textContent = column.getAttribute('header') || 'Статус';
        checkbox.checked = !column.hidden;
        checkbox.addEventListener('change', function () {
          column.hidden = !checkbox.checked;
        });
        checkbox.addEventListener('click', function (e) {
          e.stopPropagation();
        });
        root.appendChild(checkbox);
      });
    };
  }

  protected async getItems() {
    this.loading = true;
    const response = await api('/queue');
    if (response.success) this.items = response.queue;
    this.loading = false;
    this.ready = true;
  }

  protected async startHandler() {
    this.loading = true;
    const response = await api('/queue/handler');
    if (response.success) {
      componentEvent(this, 'show-notification', {
        theme: 'success',
        text: `Обработчик запущен`,
      });
    } else {
      componentEvent(this, 'show-notification', {
        theme: 'error',
        close: true,
        text: `${response.message}`,
      });
    }
    this.loading = false;
  }

  protected rowDetailsRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: QueueItem = value as QueueItem;
    if (!root.firstElementChild)
      root.innerHTML = '<vaadin-text-area></vaadin-text-area>';
    const textarea = root.querySelector('vaadin-text-area');
    if (textarea !== null) {
      textarea.value = JSON.stringify(
        JSON.parse(window.decodeURIComponent(item.notification)),
        null,
        2
      );
    }
    render(html``, root);
  };

  protected statusRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: QueueItem = value as QueueItem;
    render(
      html`<iron-icon icon="view-queue-icons:${item.status}"></iron-icon>`,
      root
    );
  };

  protected idRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: QueueItem = value as QueueItem;
    const id: string = item.id;
    render(
      html`<div class="copy">
        <vaadin-button
          theme="icon small"
          @click="${(e: CustomEvent) => {
            e.stopPropagation();
            copy(id, this);
          }}"
          ><iron-icon icon="view-queue-icons:copy"></iron-icon
        ></vaadin-button>
        <div>${id.slice(0, 15)}...</div>
      </div>`,
      root
    );
  };

  protected createdRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: QueueItem = value as QueueItem;
    const created: string = item.created;
    const date = new Date(created);
    const formatDate = date.toLocaleString();
    render(html`${formatDate}`, root);
  };

  protected updatedRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: QueueItem = value as QueueItem;
    const updated: string = item.created;
    const date = new Date(updated);
    const formatDate = date.toLocaleString();
    render(html`${formatDate}`, root);
  };

  protected instanceIdRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: QueueItem = value as QueueItem;
    const instanceId: string = item.instanceId;
    render(
      html`<div class="copy">
        <vaadin-button
          theme="icon small"
          @click="${(e: CustomEvent) => {
            e.stopPropagation();
            copy(instanceId, this);
          }}"
          ><iron-icon icon="view-queue-icons:copy"></iron-icon
        ></vaadin-button>
        <div>${instanceId.slice(0, 15)}...</div>
      </div>`,
      root
    );
  };

  render() {
    return html`
      <iron-iconset-svg size="24" name="view-queue-icons">
        <svg>
          <defs>
            <g id="copy">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </g>
            <g id="refresh">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
            </g>
            <g id="handler">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
              />
            </g>
            <g id="success">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </g>
            <g id="error">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
              />
            </g>
            <g id="waiting">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
              />
            </g>
            <g id="context">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </g>
          </defs>
        </svg>
      </iron-iconset-svg>
      <card-default header="Очередь уведомлений" ?loading="${this.loading}">
        <div id="content" slot="content">
          ${this.ready && this.items.length === 0
            ? html`<not-found-placeholder
                text="Уведомления не найдены"
              ></not-found-placeholder>`
            : null}
          <div
            id="grid-container"
            ?hidden="${!this.ready || (this.ready && this.items.length === 0)}"
          >
            <div id="actions">
              <vaadin-context-menu>
                <vaadin-button theme="icon" id="menu">
                  <iron-icon icon="view-queue-icons:context"></iron-icon>
                </vaadin-button>
              </vaadin-context-menu>

              <div id="buttons">
                <vaadin-button
                  @click="${this.startHandler}"
                  ?disabled="${this.loading}"
                  ><iron-icon
                    icon="view-queue-icons:handler"
                    slot="prefix"
                  ></iron-icon
                  >Запустить обработчик</vaadin-button
                >
                <vaadin-button
                  theme="icon"
                  @click="${this.getItems}"
                  ?disabled="${this.loading}"
                  ><iron-icon
                    icon="view-queue-icons:refresh"
                    slot="prefix"
                  ></iron-icon
                ></vaadin-button>
              </div>
            </div>
            <vaadin-grid
              theme="column-borders"
              .items="${this.items}"
              .rowDetailsRenderer="${this.rowDetailsRenderer}"
            >
              <vaadin-grid-column
                path="status"
                header=""
                width="57px"
                flex-grow="0"
                .renderer="${this.statusRenderer}"
              ></vaadin-grid-column>

              <vaadin-grid-filter-column
                path="id"
                header="ID уведомления"
                width="250px"
                flex-grow="0"
                hidden
                .renderer="${this.idRenderer}"
              ></vaadin-grid-filter-column>

              <vaadin-grid-column
                path="created"
                header="Дата создания"
                width="230px"
                flex-grow="0"
                .renderer="${this.createdRenderer}"
              ></vaadin-grid-column>

              <vaadin-grid-column
                path="updated"
                header="Дата обновления"
                width="230px"
                flex-grow="0"
                hidden
                .renderer="${this.updatedRenderer}"
              ></vaadin-grid-column>

              <vaadin-grid-filter-column
                path="name"
                header="Название уведомления"
                width="300px"
                flex-grow="0"
              ></vaadin-grid-filter-column>

              <vaadin-grid-filter-column
                path="userId"
                header="ID пользователя"
                width="210px"
                flex-grow="0"
              ></vaadin-grid-filter-column>

              <vaadin-grid-filter-column
                path="fullname"
                header="Полное имя"
                width="300px"
                flex-grow="0"
              ></vaadin-grid-filter-column>

              <vaadin-grid-filter-column
                path="instanceId"
                header="ID устройства"
                width="250px"
                flex-grow="0"
                hidden
                .renderer="${this.instanceIdRenderer}"
              ></vaadin-grid-filter-column>

              <vaadin-grid-filter-column
                path="browser"
                header="Браузер"
                width="200px"
                flex-grow="0"
              ></vaadin-grid-filter-column>

              <vaadin-grid-filter-column
                path="type"
                header="Тип устройства"
                width="150px"
                flex-grow="0"
              ></vaadin-grid-filter-column>

              <vaadin-grid-filter-column
                path="os"
                header="ОС"
                width="200px"
                flex-grow="0"
              ></vaadin-grid-filter-column>

              <vaadin-grid-filter-column
                path="device"
                header="Название устройства"
                width="200px"
                flex-grow="0"
                hidden
              ></vaadin-grid-filter-column>

              <vaadin-grid-filter-column
                path="manufacturer"
                header="Производитель"
                width="200px"
                flex-grow="0"
                hidden
              ></vaadin-grid-filter-column>
            </vaadin-grid>
          </div>
        </div>
      </card-default>
    `;
  }
}
