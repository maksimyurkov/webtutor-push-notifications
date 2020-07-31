import { css } from 'lit-element';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
// Import the main style sheets which set all the
// global custom properties
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
// import '@vaadin/vaadin-lumo-styles/icons.js';
// import '@vaadin/vaadin-lumo-styles/badge.js';
// Import the <custom-style> element from Polymer and include
// the style sheets in the global scope
import '@polymer/polymer/lib/elements/custom-style.js';

const style = document.createElement('custom-style');
style.innerHTML = `<style include="lumo-color lumo-typography"></style>`;
document.head.appendChild(style);

registerStyles(
  'vaadin-grid',
  css`
    ::-webkit-scrollbar,
    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-corner {
      background-color: var(--lumo-contrast-5pct);
    }

    ::-webkit-scrollbar::vertical {
      width: 5px;
    }

    ::-webkit-scrollbar-button::horizontal {
      height: 5px;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--lumo-contrast-30pct);
    }

    a {
      color: var(--lumo-primary-text-color);
      text-decoration: none;
    }

    [part~='cell'].success {
      background-color: var(--lumo-success-color-10pct);
    }

    [part~='cell'].error {
      background-color: var(--lumo-error-color-10pct);
    }
  `
);
