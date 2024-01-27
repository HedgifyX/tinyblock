import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { DataViewShortText } from './shortText-view.js';
import type { DataViewShortTextManager } from './shortText-view-manager.js';

const styles = css`
  .affine-components-block-input-container {
    border: none;
    border-radius: 4px;
    background-color: var(--affine-background-code-block);
    width: 100%;
    height: 40px;
  }

  .affine-components-block-input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 8px;
    font-size: 14px;
    line-height: 20px;
    color: var(--affine-text-primary-color);
    background-color: transparent;
  }
`;

@customElement('affine-data-view-input')
export class Input extends WithDisposable(ShadowlessElement) {
  static override styles = styles;

  @property({ attribute: false })
  view!: DataViewShortTextManager;
  @property({ attribute: false })
  viewEle!: DataViewShortText;

  rendeInput(): unknown {
    return html`
      <div class="affine-components-block-input-container">
        <input type="text" class="affine-components-block-input" disabled />
      </div>
    `;
  }

  override render() {
    return html` ${this.rendeInput()} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-data-view-input': Input;
  }
}
