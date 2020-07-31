import { html, css, LitElement, property, customElement } from 'lit-element';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-iconset-svg';

@customElement('theme-toggle')
export class ThemeToggle extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
      contain: content;
    }
  `;

  @property({ type: String }) theme = 'light';

  toggle() {
    let theme = window.localStorage.getItem(
      'webtutor-push-notifications-theme'
    );
    if (theme === null) {
      theme = 'light';
    } else {
      theme === 'light' ? (theme = 'dark') : (theme = 'light');
    }
    window.localStorage.setItem('webtutor-push-notifications-theme', theme);
    this.theme = theme;
    document.querySelector('html')?.setAttribute('theme', theme);
  }

  constructor() {
    super();
    const isIE11 =
      navigator.userAgent.indexOf('MSIE') !== -1 ||
      navigator.appVersion.indexOf('Trident/') > -1;
    if (isIE11) this.style.display = 'none';
  }

  render() {
    return html`
      <iron-iconset-svg size="24" name="dark-light-toggle-icons">
        <svg>
          <defs>
            <g id="dark">
              <g>
                <path
                  d="M11.1,12.08C8.77,7.57,10.6,3.6,11.63,2.01C6.27,2.2,1.98,6.59,1.98,12c0,0.14,0.02,0.28,0.02,0.42 C2.62,12.15,3.29,12,4,12c1.66,0,3.18,0.83,4.1,2.15C9.77,14.63,11,16.17,11,18c0,1.52-0.87,2.83-2.12,3.51 c0.98,0.32,2.03,0.5,3.11,0.5c3.5,0,6.58-1.8,8.37-4.52C18,17.72,13.38,16.52,11.1,12.08z"
                />
              </g>
              <path
                d="M7,16l-0.18,0C6.4,14.84,5.3,14,4,14c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.62,0,2.49,0,3,0c1.1,0,2-0.9,2-2 C9,16.9,8.1,16,7,16z"
              />
            </g>
            <g id="light">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"
              />
            </g>
          </defs>
        </svg>
      </iron-iconset-svg>
      <paper-icon-button
        icon="dark-light-toggle-icons:${this.theme === 'dark'
          ? 'light'
          : 'dark'}"
        @click="${this.toggle}"
      ></paper-icon-button>
    `;
  }
}
