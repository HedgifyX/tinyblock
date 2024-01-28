import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { DataViewAssigneeSelect } from './assigneeSelect-view.js';
import type { DataViewAssigneeSelectManager } from './assigneeSelect-view-manager.js';

const styles = css`
  .affine-components-block-assigneeselect-container {
    border: none;
    border-radius: 4px;
    width: 100%;
    height: 40px;
  }

  .affine-components-block-assigneeselect {
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

  .affine-components-block-assigneeselect-button {
    width: 100%;
    border: none;
    outline: none;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 20px;
    color: var(--affine-palette-line-blue);
    background-color: transparent;
    text-align: left;
    display: inline-flex;
  }

  .affine-components-block-assigneeselect-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
    fill: var(--affine-palette-line-blue);
  }
`;

@customElement('affine-data-view-assigneeselect')
export class AssigneeSelect extends WithDisposable(ShadowlessElement) {
  static override styles = styles;

  @property({ attribute: false })
  view!: DataViewAssigneeSelectManager;
  @property({ attribute: false })
  viewEle!: DataViewAssigneeSelect;

  rendeAttachment(): unknown {
    return html`
      <div class="affine-components-block-assigneeselect-container">
        <button
          class="affine-components-block-assigneeselect-button"
          type="button"
        >
          <div class="affine-components-block-assigneeselect-icon">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                  fill="currentColor"
                  d="M2.343 7.5a.5.5 0 0 0 0 1H7.5v5.157a.5.5 0 1 0 1 0V8.5h5.157a.5.5 0 0 0 0-1H8.502V2.343a.5.5 0 1 0-1.001 0V7.5H2.343Z"
                ></path>
              </svg>
            </div>
          </div>
          Add Assignee
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
    'affine-data-view-assigneeselect': AssigneeSelect;
  }
}
