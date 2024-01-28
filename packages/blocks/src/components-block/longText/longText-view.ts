// related component
import './textarea.js';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { renderUniLit } from '../../_common/components/uni-component/uni-component.js';
import type { LongTextViewSelection } from '../../_common/utils/index.js';
import { BaseDataViewForComponents } from '../common/base-data-view.js';
import type { DataViewLongTextManager } from './longText-view-manager.js';
const styles = css``;

@customElement('affine-components-longtext')
export class DataViewLongText extends BaseDataViewForComponents<
  DataViewLongTextManager,
  LongTextViewSelection
> {
  static override styles = styles;

  private get readonly() {
    return this.view.readonly;
  }

  private renderLongText() {
    return html`<affine-data-view-textarea
      .view="${this.view}"
      .viewEle="${this}"
    ></affine-data-view-textarea>`;
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
      <div class="affine-components-longtext">
        <div class="affine-components-block-longText" @wheel="${this.onWheel}">
          <div class="affine-components-longtext-container">
            ${this.renderLongText()}
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
    'affine-components-longtext': DataViewLongText;
  }
}
