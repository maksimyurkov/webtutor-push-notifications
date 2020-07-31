import {
  html,
  css,
  LitElement,
  property,
  customElement,
  query,
} from 'lit-element';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-button/vaadin-button';
const TextAreaElement = customElements.get('vaadin-textarea-field');

import { api, componentEvent } from '../../shared-functions.js';
import '../../card-default.js';

@customElement('view-settings-firebase')
export class ViewSettingsFirebase extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
    }

    #firebase-config {
      min-height: 230px;
    }

    #server-key {
      min-height: 100px;
    }
  `;

  @property({ type: Boolean }) loading = true;
  @property({ type: Boolean }) saveDisabled = true;
  @property({ type: String }) firebaseConfig = '';
  @property({ type: String }) serverKey = '';
  @property({ type: Array }) firebaseConfigKeys = [
    'apiKey',
    'authDomain',
    'databaseURL',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  @query('#firebase-config')
  firebaseConfigInput?: typeof TextAreaElement;
  @query('#server-key')
  serverKeyInput?: typeof TextAreaElement;

  firstUpdated() {
    this.config();
  }

  protected async config() {
    this.loading = true;
    const response = await api(`/config`);
    if (response.success) {
      const config = response.config;
      this.serverKey = config.serverKey;
      delete config['serverKey'];
      if (config.projectId !== '' && config.serverKey !== '') {
        const formattedFirebaseConfig = await this.formatFirebaseConfigString(
          JSON.stringify(config)
        );
        this.firebaseConfig = formattedFirebaseConfig;
        this.firebaseConfigInput.value = formattedFirebaseConfig;
        componentEvent(this, 'config-exists');
      } else {
        this.firebaseConfig = '';
        this.firebaseConfigInput.value = '';
      }
    }
    this.loading = false;
  }

  protected async save() {
    this.loading = true;
    const config = JSON.parse(this.firebaseConfig);
    config.serverKey = this.serverKey;
    await api('/config/set', JSON.stringify(config));
    componentEvent(this, 'config-exists');
    componentEvent(this, 'config-updated');
    componentEvent(this, 'show-notification', {
      theme: 'success',
      text: 'Настройки сохранены',
    });
    this.loading = false;
  }

  protected async formatFirebaseConfigString(firebaseConfigString: string) {
    return firebaseConfigString
      .replace(/\s/g, '')
      .replace(/const|firebaseConfig|=|;/g, '')
      .replace(/{/g, '{\n  ')
      .replace(/,/g, ',\n  ')
      .replace(/}/g, '\n}');
  }

  protected async getFormatterFirebaseConfigFromString(inputValue: string) {
    try {
      const keyValueArray = inputValue
        .replace(/\s/g, '')
        .replace(/const|firebaseConfig|=|;|{|}/g, '')
        .split(',');
      const currentConfigObj: { [key: string]: string } = {};
      for (const item of keyValueArray) {
        const keyValueArray = item.split(':"');
        const key = keyValueArray[0].replace(/"/g, '');
        const value = keyValueArray[1].replace(/"/g, '');
        currentConfigObj[key] = value;
      }
      const firebaseConfigObj: { [key: string]: string } = {};
      for (const key of this.firebaseConfigKeys) {
        if (
          currentConfigObj[key] === undefined ||
          currentConfigObj[key] === ''
        ) {
          return false;
        } else {
          firebaseConfigObj[key] = currentConfigObj[key];
        }
      }
      const formattedFirebaseConfigString = await this.formatFirebaseConfigString(
        JSON.stringify(firebaseConfigObj)
      );
      return formattedFirebaseConfigString;
    } catch (error) {
      return false;
    }
  }

  protected async inputChanged(e: CustomEvent) {
    const elem: typeof TextAreaElement = e.target;
    const id: string = elem.id;
    const inputValue = elem.value;
    if (id === 'firebase-config') {
      const formattedConfig = await this.getFormatterFirebaseConfigFromString(
        inputValue
      );
      if (formattedConfig) {
        this.firebaseConfig = formattedConfig;
        elem.value = formattedConfig;
        elem.invalid = false;
      } else {
        this.firebaseConfig = inputValue;
        elem.value = inputValue;
        elem.invalid = true;
      }
    }
    if (id === 'server-key') {
      if (inputValue === '') {
        elem.invalid = true;
      } else {
        elem.invalid = false;
      }
      this.serverKey = inputValue;
      elem.value = inputValue;
    }
    if (this.firebaseConfigInput.invalid || this.serverKeyInput.invalid) {
      this.saveDisabled = true;
    } else {
      this.saveDisabled = false;
    }
  }

  render() {
    return html`
      <card-default header="Настройки Firebase" ?loading="${this.loading}">
        <vaadin-form-layout slot="content">
          <vaadin-text-area
            id="firebase-config"
            label="Конфигурация Firebase"
            .disabled="${this.loading}"
            error-message="Конфигурация некорректна"
            .value="${this.firebaseConfig}"
            @input="${this.inputChanged}"
            @change="${this.inputChanged}"
          ></vaadin-text-area>
          <vaadin-text-area
            id="server-key"
            label="Ключ сервера"
            .disabled="${this.loading}"
            error-message="Серверный ключ некорректен"
            .value="${this.serverKey}"
            @input="${this.inputChanged}"
            @change="${this.inputChanged}"
          ></vaadin-text-area>
        </vaadin-form-layout>
        <vaadin-button
          slot="actions"
          ?disabled="${this.loading || this.saveDisabled}"
          @click="${this.save}"
          >Сохранить</vaadin-button
        >
      </card-default>
    `;
  }
}
