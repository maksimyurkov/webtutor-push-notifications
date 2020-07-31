import {
  html,
  css,
  LitElement,
  property,
  customElement,
  query,
} from 'lit-element';
import '@vaadin/vaadin-tabs/vaadin-tabs';

import './components/views/view-settings/view-settings.js';
import './components/component-notification.js';
import './components/sign-in.js';
import './components/theme-toggle.js';
import './components/vaadin-styles.js';
const ComponentNotification = customElements.get('component-notification');

declare global {
  interface Window {
    webtutorPushNotificationsApiUrl: string;
  }
}

@customElement('webtutor-push-notifications')
export class WebtutorPushNotifications extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
      max-width: 936px;
      min-height: 100vh;
      margin: auto;
      padding: var(--lumo-space-tall-l);
      font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI',
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
    }

    h1 {
      font-size: var(--lumo-font-size-xxl);
    }

    #header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    @media (max-width: 500px) {
      h1 {
        font-size: var(--lumo-font-size-xl);
      }
    }
  `;

  @property({ type: Array }) views = [
    {
      text: 'Настройки',
      value: 'settings',
    },
    {
      text: 'Тест',
      value: 'test',
    },
    {
      text: 'Очередь',
      value: 'queue',
    },
    {
      text: 'Ключи',
      value: 'keys',
    },
  ];

  @property({ type: String }) currentView = 'settings';
  @property({ type: Boolean }) installMode = true;
  @property({ type: Boolean }) deleteMode = false;
  @property({ type: Boolean }) signedIn = false;
  @property({ type: String }) theme = 'dark';

  @query('component-notification')
  componentNotificationElement?: typeof ComponentNotification;

  constructor() {
    super();
    window.webtutorPushNotificationsApiUrl =
      this.getAttribute('api-url') ||
      `${window.location.origin}/node_modules/@maksimyurkov/webtutor-push-notifications/webtutor/api.html`;
    const theme =
      window.localStorage.getItem('webtutor-push-notifications-theme') ||
      'dark';
    window.localStorage.setItem('webtutor-push-notifications-theme', theme);
    this.theme = theme;
    document.querySelector('html')?.setAttribute('theme', theme);
    this.addEventListener('config-exists', e => {
      e.stopPropagation();
      this.installMode = false;
    });
    this.addEventListener('show-notification', (e: Event) => {
      e.stopPropagation();
      const detail = (e as CustomEvent).detail;
      if (this.componentNotificationElement)
        this.componentNotificationElement.show(detail);
    });
    this.addEventListener('signed-in', (e: Event) => {
      e.stopPropagation();
      this.signedIn = true;
    });
    this.addEventListener('delete-mode', (e: Event) => {
      e.stopPropagation();
      const detail = (e as CustomEvent).detail;
      this.deleteMode = detail.deleteMode;
    });
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'settings':
        import('./components/views/view-settings/view-settings.js');
        return html`<view-settings></view-settings>`;
      case 'test':
        import('./components/views/view-test/view-test.js');
        return html`<view-test></view-test>`;
      case 'queue':
        import('./components/views/view-queue/view-queue.js');
        return html`<view-queue></view-queue>`;
      case 'keys':
        import('./components/views/view-keys/view-keys.js');
        return html`<view-keys></view-keys>`;
    }
  }

  viewChanged(e: CustomEvent) {
    this.currentView = this.views[e.detail.value].value;
  }

  render() {
    return html`
      ${this.signedIn
        ? html`<div id="header">
              <h1>WebTutor Push Notifications</h1>
              <theme-toggle .theme="${this.theme}"></theme-toggle>
            </div>
            <vaadin-tabs @selected-changed="${this.viewChanged}">
              ${this.views.map(
                view =>
                  html`<vaadin-tab
                    ?disabled="${view.value !== 'settings' &&
                    (this.installMode || this.deleteMode)}"
                    >${view.text}</vaadin-tab
                  >`
              )}
            </vaadin-tabs>
            ${this.renderCurrentView()}`
        : html`<sign-in></sign-in>`}
      <component-notification></component-notification>
    `;
  }
}
