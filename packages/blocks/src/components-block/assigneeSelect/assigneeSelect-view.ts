// related component
import './assigneeSelect.js';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { renderUniLit } from '../../_common/components/uni-component/uni-component.js';
import type { AssigneeSelectViewSelection } from '../../_common/utils/index.js';
import { BaseDataViewForComponents } from '../common/base-data-view.js';
import type { DataViewAssigneeSelectManager } from './assigneeSelect-view-manager.js';

const styles = css``;

@customElement('affine-components-assigneeselect')
export class DataViewAssigneeSelect extends BaseDataViewForComponents<
  DataViewAssigneeSelectManager,
  AssigneeSelectViewSelection
> {
  static override styles = styles;

  private renderAssigneeSelect() {
    return html`<affine-data-view-assigneeselect
      .view="${this.view}"
      .viewEle="${this}"
    ></affine-data-view-assigneeselect>`;
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
      <div class="affine-components-assigneeselect">
        <div
          class="affine-components-block-assigneeselect"
          @wheel="${this.onWheel}"
        >
          <div class="affine-components-assigneeselect-container">
            ${this.renderAssigneeSelect()}
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
    'affine-components-assigneeselect': DataViewAssigneeSelect;
  }
}
