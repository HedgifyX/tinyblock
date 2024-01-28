import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { DataViewLongText } from './longText-view.js';
import type { DataViewLongTextManager } from './longText-view-manager.js';

const styles = css`
  .affine-components-block-textarea-container {
    border: none;
    width: 100%;
  }

  .affine-components-block-textarea {
    min-width: 100%;
    min-height: 112px;
    border: none;
    outline: none;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 20px;
    color: var(--affine-text-primary-color);
    border-radius: 4px;
    resize: none;
    background-color: var(--affine-background-code-block);
  }
`;

@customElement('affine-data-view-textarea')
export class TextArea extends WithDisposable(ShadowlessElement) {
  static override styles = styles;

  @property({ attribute: false })
  view!: DataViewLongTextManager;
  @property({ attribute: false })
  viewEle!: DataViewLongText;

  rendeInput(): unknown {
    return html`
      <div class="affine-components-block-textarea-container">
        <textarea class="affine-components-block-textarea" disabled></textarea>
      </div>
    `;
  }

  override render() {
    return html` ${this.rendeInput()} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-data-view-textarea': TextArea;
  }
}
