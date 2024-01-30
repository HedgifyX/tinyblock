import type { EditorHost } from '@blocksuite/lit';
import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { DataViewAssigneeSelectManager } from '../../assigneeSelect/assigneeSelect-view-manager.js';
import type { DataViewAttachmentManager } from '../../attachment/attachment-view-manager.js';
import type { DataViewLongTextManager } from '../../longText/longText-view-manager.js';
import type { DataViewShortTextManager } from '../../shortText/shortText-view-manager.js';
import type { DetailSlotPropsForComponents } from './base.js';

@customElement('components-datasource-block-renderer')
export class BlockRendererForComponents
  extends WithDisposable(ShadowlessElement)
  implements DetailSlotPropsForComponents
{
  static override styles = css`
    components-datasource-block-renderer {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 4px;
      border-bottom: 1px solid var(--affine-border-color);
      font-size: var(--affine-font-base);
      line-height: var(--affine-line-height);
    }

    components-datasource-block-renderer .tips-placeholder {
      display: none;
    }

    .components-block-detail-header-icon {
      width: 20px;
      height: 20px;
      padding: 2px;
      border-radius: 4px;
      background-color: var(--affine-background-secondary-color);
    }

    .components-block-detail-header-icon svg {
      width: 16px;
      height: 16px;
    }
  `;
  @property({ attribute: false })
  public view!:
    | DataViewShortTextManager
    | DataViewLongTextManager
    | DataViewAssigneeSelectManager
    | DataViewAttachmentManager;
  @property({ attribute: false })
  public rowId!: string;
  root?: EditorHost;

  get model() {
    return this.root?.page.getBlockById(this.rowId);
  }

  public override connectedCallback() {
    super.connectedCallback();
    this.root = this.closest('editor-host') ?? undefined;
    this._disposables.addFromEvent(
      this,
      'keydown',
      e => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        if (
          e.key === 'Backspace' &&
          !e.shiftKey &&
          !e.metaKey &&
          this.model?.text?.length === 0
        ) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      },
      true
    );
  }
}
