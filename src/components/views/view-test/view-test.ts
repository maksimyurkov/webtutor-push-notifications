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
const TextAreaElement = customElements.get('vaadin-textarea-field');
const ButtonElement = customElements.get('vaadin-button');
const ContextMenuElement = customElements.get('vaadin-context-menu');
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-text-field/vaadin-text-area.js';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
import '@polymer/iron-iconset-svg';
import '@polymer/iron-icon';

import '../../not-found-placeholder.js';
import '../../card-default.js';
import { api, componentEvent, copy } from '../../shared-functions.js';

interface InstanceItem {
  id: string;
  created: string;
  instanceId: string;
  userId: number;
  fullname: string;
  browser: string;
  device: string;
  type: string;
  manufacturer: string;
  os: string;
}

@customElement('view-test')
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

    vaadin-text-area {
      width: 100%;
      min-height: 235px;
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

    [hidden] {
      display: none;
    }
  `;

  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) ready = false;
  @property({ type: Array }) items: Array<InstanceItem> = [];
  @property({ type: Array }) selectedItems: Array<InstanceItem> = [];

  @query('vaadin-grid')
  grid?: GridElement;

  @query('vaadin-text-area')
  input?: typeof TextAreaElement;

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
    this.initContextMenu();
  }

  protected async send() {
    this.loading = true;
    const instances = this.selectedItems.map(instance => instance.instanceId);
    const response = await api(
      '/send',
      JSON.stringify([
        {
          instances: instances,
          name: 'Тестовое уведомление',
          notification: JSON.parse(this.input.value),
        },
      ])
    );
    if (response.success) {
      componentEvent(this, 'show-notification', {
        theme: 'success',
        text: `Добавлено в очередь`,
      });
    } else {
      componentEvent(this, 'show-notification', {
        theme: 'error',
        close: true,
        text: `Возникла ошибка: ${response.message}`,
      });
    }
    this.loading = false;
  }

  protected async getItems() {
    this.loading = true;
    const response = await api('/instances');
    if (response.success) {
      this.items = response.instances;
    }
    this.loading = false;
    this.ready = true;
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

  protected selectedChanged() {
    if (this.grid?.selectedItems && Array.isArray(this.grid?.selectedItems)) {
      this.selectedItems = this.grid?.selectedItems;
      this.requestUpdate();
    }
  }

  protected instanceIdRenderer: GridBodyRenderer = (root, column, rowData) => {
    const value: unknown = rowData?.item;
    const item: InstanceItem = value as InstanceItem;
    const instanceId: string = item.instanceId;
    render(
      html`<div class="copy">
        <vaadin-button
          theme="icon small"
          @click="${(e: CustomEvent) => {
            e.stopPropagation();
            copy(instanceId, this);
          }}"
          ><iron-icon icon="view-test-icons:copy"></iron-icon
        ></vaadin-button>
        <div>${instanceId.slice(0, 15)}...</div>
      </div>`,
      root
    );
  };

  render() {
    return html`
      <iron-iconset-svg size="24" name="view-test-icons">
        <svg>
          <defs>
            <g id="copy">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </g>
            <g id="context">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </g>
          </defs>
        </svg>
      </iron-iconset-svg>
      <card-default header="Отправить уведомление" ?loading="${this.loading}">
        <div id="content" slot="content">
          ${this.ready && this.items.length === 0
            ? html`<not-found-placeholder
                text="Устройства не найдены"
              ></not-found-placeholder>`
            : null}
          <div
            id="grid-container"
            ?hidden="${!this.ready || (this.ready && this.items.length === 0)}"
          >
            <div id="actions">
              <vaadin-context-menu>
                <vaadin-button theme="icon" id="menu">
                  <iron-icon icon="view-test-icons:context"></iron-icon>
                </vaadin-button>
              </vaadin-context-menu>

              <div id="buttons">
                <vaadin-button
                  slot="actions"
                  @click="${this.send}"
                  ?disabled="${this.loading || this.selectedItems.length === 0}"
                  >Отправить</vaadin-button
                >
              </div>
            </div>
            <vaadin-grid
              theme="column-borders"
              .items="${this.items}"
              @selected-items-changed="${this.selectedChanged}"
            >
              <vaadin-grid-selection-column
                auto-select
                flex-grow="0"
              ></vaadin-grid-selection-column>
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
                path="instanceId"
                header="ID устройства"
                width="250px"
                flex-grow="0"
                hidden
                .renderer="${this.instanceIdRenderer}"
              ></vaadin-grid-filter-column>
              <vaadin-grid-filter-column
                path="device"
                header="Название устройства"
                width="200px"
                flex-grow="0"
              ></vaadin-grid-filter-column>
              <vaadin-grid-filter-column
                path="manufacturer"
                header="Производитель"
                width="200px"
                flex-grow="0"
              ></vaadin-grid-filter-column>
            </vaadin-grid>
            <vaadin-text-area
              label="Тестовое уведомление"
              colspan="7"
              .value="${`{
  "data": {
    "title": "COVID-19",
    "body": "Объяснение и рекомендации",
    "icon": "https://img.youtube.com/vi/ESciUcntVnk/mqdefault.jpg",
    "image": "https://img.youtube.com/vi/ESciUcntVnk/maxresdefault.jpg",
    "click_action": "https://www.youtube.com/watch?v=BtN-goy9VOY"
  }
}`}"
            ></vaadin-text-area>
          </div>
        </div>
      </card-default>
    `;
  }
}
