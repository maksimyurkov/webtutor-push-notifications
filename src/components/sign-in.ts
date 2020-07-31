import { html, css, LitElement, customElement } from 'lit-element';
import '@vaadin/vaadin-progress-bar';
import '@vaadin/vaadin-button/vaadin-button';

import { api, componentEvent } from './shared-functions.js';

@customElement('sign-in')
export class SignIn extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        h2 {
          text-transform: uppercase;
        }

        a {
          color: var(--lumo-primary-text-color);
          text-decoration: none;
        }

        p {
          margin-top: 0;
        }

        svg {
          width: 96px;
        }

        vaadin-progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          margin: 0;
        }

        vaadin-button {
          cursor: pointer;
        }

        #container {
          max-width: 500px;
          position: relative;
          box-sizing: border-box;
          text-align: center;
          box-shadow: var(--lumo-box-shadow-s);
          padding: var(--lumo-space-xl);
          border-radius: var(--lumo-border-radius);
          overflow: hidden;
          background: var(--lumo-tint-5pct);
        }
      `,
    ];
  }

  firstUpdated() {
    this.signIn();
  }

  protected async signIn(intervalId?: number) {
    const response = await api('/access/admin');
    if (response.success) {
      componentEvent(this, 'signed-in');
      if (intervalId) clearInterval(intervalId);
    } else {
      if (intervalId === undefined) {
        const intervalId = window.setInterval(async () => {
          this.signIn(intervalId);
        }, 3000);
      }
    }
  }

  render() {
    return html` <div id="container">
      <vaadin-progress-bar indeterminate value="0"></vaadin-progress-bar>
      <svg
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        style="enable-background:new 0 0 512 512;"
        xml:space="preserve"
      >
        <path
          style="fill:#E7E7E7;"
          d="M256,0L30.912,64.225v112.844c0,144.956,86.134,275.508,219.086,332.529L256,512l6.002-2.402
	c132.952-57.021,219.086-187.573,219.086-332.529V64.225L256,0z"
        />
        <path
          style="fill:#D3D3D8;"
          d="M481.088,64.225v112.844c0,144.956-86.134,275.508-219.086,332.529L256,512V0L481.088,64.225z"
        />
        <path
          style="fill:#00ABE9;"
          d="M256,62.425L90.936,109.544v67.526c0,111.042,60.625,212.482,157.862,265.303l7.203,3.902
	l7.203-3.902c97.238-52.821,157.862-154.26,157.862-265.303v-67.526L256,62.425z"
        />
        <path
          style="fill:#0095FF;"
          d="M421.064,109.544v67.526c0,111.042-60.625,212.482-157.862,265.303L256,446.274V62.425
	L421.064,109.544z"
        />
      </svg>
      <h2>Нет доступа</h2>
      <p>
        Войдите в <a href="/" target="_blank">WebTutor</a> с правами
        администратора
      </p>
      <a href="/" target="_blank"
        ><vaadin-button theme="primary large">Войти</vaadin-button></a
      >
    </div>`;
  }
}
