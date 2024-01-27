// related component
import './input.js';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { renderUniLit } from '../../_common/components/uni-component/uni-component.js';
import type { ShortTextViewSelection } from '../../_common/utils/index.js';
import { BaseDataViewForComponents } from '../common/base-data-view.js';
import type { DataViewShortTextManager } from './shortText-view-manager.js';

const styles = css``;

@customElement('affine-components-shorttext')
export class DataViewShortText extends BaseDataViewForComponents<
  DataViewShortTextManager,
  ShortTextViewSelection
> {
  static override styles = styles;

  private get readonly() {
    return this.view.readonly;
  }

  private renderShortText() {
    return html`<affine-data-view-input
      .view="${this.view}"
      .viewEle="${this}"
    ></affine-data-view-input>`;
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
      <div class="affine-components-shorttext">
        <div class="affine-components-block-shortText" @wheel="${this.onWheel}">
          <div class="affine-components-shorttext-container">
            ${this.renderShortText()}
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
    'affine-components-shorttext': DataViewShortText;
  }
}
