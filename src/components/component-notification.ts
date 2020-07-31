'use strict';
import {
  LitElement,
  html,
  css,
  customElement,
  query,
  property,
} from 'lit-element';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-notification';
const VaadinNotificationElement = customElements.get('vaadin-notification');

const ComponentNotificationElement = customElements.get(
  'component-notification'
);

export interface NotificationOptions {
  text: string;
  theme?: string;
  close?: boolean;
  duration?: number;
}

@customElement('component-notification')
export class ComponentNotification extends LitElement {
  static get styles() {
    return css`
      a {
        text-decoration: none;
        color: inherit;
        outline: none;
        padding: 0;
        margin: 0;
      }
    `;
  }

  @property({ type: Array }) store: Array<NotificationOptions> = [];
  @property({ type: String }) theme = '';
  @property({ type: Number }) duration = 3000;

  @query('vaadin-notification')
  vaadinNotification?: typeof VaadinNotificationElement;

  protected openedChanged(e: CustomEvent) {
    // Если уведомление закрылось
    if (!e.detail.value) {
      // Ждем пока пройдет анимация закрытия
      setTimeout(() => {
        this.store.splice(0, 1);
        this.handleStore();
      }, 1000);
    }
  }

  protected handleStore() {
    if (this.store.length === 0) return;
    this.open(this.store[0]);
  }

  async show(options: NotificationOptions) {
    this.store.push(options);
    this.handleStore();
  }

  protected open(options: NotificationOptions) {
    this.theme = options.theme || '';
    this.duration = options.duration || 3000;
    if (options.close) this.duration = 0;
    this.vaadinNotification.renderer = function (
      root: HTMLElement,
      owner: typeof ComponentNotificationElement
    ) {
      root.textContent = options.text;
      if (options.close) {
        const closeBtn = window.document.createElement('vaadin-button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.addEventListener('click', function () {
          owner.close();
        });
        root.appendChild(closeBtn);
      }
    };
    this.vaadinNotification.open();
  }

  protected close() {
    this.vaadinNotification.close();
  }

  render() {
    return html`
      <vaadin-notification
        theme="${this.theme}"
        duration="${this.duration}"
        @opened-changed="${this.openedChanged}"
      ></vaadin-notification>
    `;
  }
}
