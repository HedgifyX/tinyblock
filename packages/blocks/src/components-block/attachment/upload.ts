import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { DataViewAttachment } from './attachment-view.js';
import type { DataViewAttachmentManager } from './attachment-view-manager.js';

const styles = css`
  .affine-components-block-attachment-container {
    border: none;
    border-radius: 4px;
    width: 100%;
    height: 40px;
  }

  .affine-components-block-attachment {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 8px;
    font-size: 14px;
    line-height: 20px;
    color: var(--affine-palette-line-blue);
    background-color: transparent;
  }

  .affine-components-block-attachment-button {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 20px;
    color: var(--affine-palette-line-blue);
    background-color: transparent;
    text-align: left;
  }

  .affine-components-block-attachment-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
    fill: var(--affine-palette-line-blue);
  }
`;

@customElement('affine-data-view-attachment')
export class Attachment extends WithDisposable(ShadowlessElement) {
  static override styles = styles;

  @property({ attribute: false })
  view!: DataViewAttachmentManager;
  @property({ attribute: false })
  viewEle!: DataViewAttachment;

  rendeAttachment(): unknown {
    return html`
      <div class="affine-components-block-attachment-container">
        <button class="affine-components-block-attachment-button" type="button">
          <div class="affine-components-block-attachment-icon">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M4.343 7.5a.5.5 0 0 0 0 1H7.5v3.157a.5.5 0 1 0 1 0V8.5h3.157a.5.5 0 0 0 0-1H8.502V4.343a.5.5 0 1 0-1.001 0V7.5H4.343Z"
                ></path>
              </svg>
            </div>
          </div>
          Upload file
        </button>
      </div>
    `;
  }

  override render() {
    return html` ${this.rendeAttachment()} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-data-view-attachment': Attachment;
  }
}
