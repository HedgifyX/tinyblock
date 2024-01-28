// related component
import './upload.js';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { renderUniLit } from '../../_common/components/uni-component/uni-component.js';
import type { AttachmentViewSelection } from '../../_common/utils/index.js';
import { BaseDataViewForComponents } from '../common/base-data-view.js';
import type { DataViewAttachmentManager } from './attachment-view-manager.js';

const styles = css``;

@customElement('affine-components-attachment')
export class DataViewAttachment extends BaseDataViewForComponents<
  DataViewAttachmentManager,
  AttachmentViewSelection
> {
  static override styles = styles;

  private get readonly() {
    return this.view.readonly;
  }

  private renderAttachment() {
    return html`<affine-data-view-attachment
      .view="${this.view}"
      .viewEle="${this}"
    ></affine-data-view-attachment>`;
  }

  onWheel = (event: WheelEvent) => {
    if (event.metaKey || event.ctrlKey) {
      return;
    }
    const ele = event.currentTarget;
    if (ele instanceof HTMLElement) {
      if (ele.scrollWidth === ele.clientWidth) {
        return;
      }
      event.stopPropagation();
    }
  };

  override render() {
    return html`
      ${renderUniLit(this.header, { view: this.view, viewMethods: this })}
      <div class="affine-components-attachment">
        <div
          class="affine-components-block-attachment"
          @wheel="${this.onWheel}"
        >
          <div class="affine-components-attachment-container">
            ${this.renderAttachment()}
          </div>
        </div>
      </div>
    `;
  }

  focusInputText(): void {
    //this.selectionController.focusInputText();
  }

  getSelection() {
    //return this.selectionController.selection;
    return undefined;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-components-attachment': DataViewAttachment;
  }
}
