import type { EditorHost } from '@blocksuite/lit';
import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { DetailSlotPropsForComponents } from './base.js';
import type { DataViewShortTextManager } from './shortText/shortText-view-manager.js';

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
  public view!: DataViewShortTextManager;
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

  renderIcon() {
    const iconColumn = this.view.header.iconColumn;
    if (!iconColumn) {
      return;
    }
    return html` <div class="components-block-detail-header-icon">
      ${this.view.cellGetValue(this.rowId, iconColumn)}
    </div>`;
  }

  protected override render(): unknown {
    const model = this.model;
    if (!model) {
      return;
    }
    return html` ${this.root?.renderModel(model)} ${this.renderIcon()} `;
  }
}
