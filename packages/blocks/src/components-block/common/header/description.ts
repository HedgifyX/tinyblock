import { assertExists } from '@blocksuite/global/utils';
import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import type { Text } from '@blocksuite/store';
import { css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { RichText } from '../../../_common/components/rich-text/rich-text.js';

@customElement('affine-components-description')
export class ComponentsDescription extends WithDisposable(ShadowlessElement) {
  static override styles = css`
    .affine-components-description {
      position: relative;
      flex: 1;
    }

    .components-description {
      font-size: 14px;
      font-weight: 400;
      line-height: var(--affine-line-height);
      color: var(--affine-text-secondary-color);
      font-family: inherit;
      /* overflow-x: scroll; */
      overflow: hidden;
      cursor: text;
    }

    .components-description [data-v-text='true'] {
      display: block;
      word-break: break-all !important;
    }

    .components-description.ellipsis [data-v-text='true'] {
      white-space: nowrap !important;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .components-description-empty [data-v-root='true']::before {
      content: 'No description';
      position: absolute;
      pointer-events: none;
      color: var(--affine-text-secondary-color);
    }

    .components-description-empty [data-v-root='true']:focus::before {
      color: var(--affine-placeholder-color);
    }
  `;

  @property({ attribute: false })
  descriptionText!: Text;

  @property({ attribute: false })
  readonly!: boolean;

  @property({ attribute: false })
  onPressEnterKey?: () => void;

  @state()
  isComposing = false;

  @query('rich-text')
  private richText!: RichText;
  get inlineEditor() {
    assertExists(this.richText.inlineEditor);
    return this.richText.inlineEditor;
  }
  get inlineEditorContainer() {
    return this.inlineEditor.rootElement;
  }

  override firstUpdated() {
    // for title placeholder
    this.descriptionText.yText.observe(() => {
      this.requestUpdate();
    });

    this.updateComplete
      .then(() => {
        this.disposables.addFromEvent(
          this.inlineEditorContainer,
          'focus',
          this._onTitleFocus
        );
        this.disposables.addFromEvent(
          this.inlineEditorContainer,
          'blur',
          this._onTitleBlur
        );
        this.disposables.addFromEvent(
          this.inlineEditorContainer,
          'compositionstart',
          () => {
            this.isComposing = true;
          }
        );
        this.disposables.addFromEvent(
          this.inlineEditorContainer,
          'compositionend',
          () => {
            this.isComposing = false;
          }
        );
        this.disposables.addFromEvent(
          this.inlineEditorContainer,
          'keydown',
          this._onKeyDown
        );
      })
      .catch(console.error);
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.richText?.updateComplete;
    return result;
  }

  private _onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.isComposing) {
      // prevent insert v-line
      event.preventDefault();
      // insert new row
      this.onPressEnterKey?.();
      return;
    }
  };

  @state()
  private isActive = false;
  private _onTitleFocus = () => {
    this.isActive = true;
  };
  private _onTitleBlur = () => {
    this.isActive = false;
  };

  override render() {
    const isEmpty =
      (!this.descriptionText || !this.descriptionText.length) &&
      !this.isComposing;

    const classList = classMap({
      'components-description': true,
      'components-description-empty': isEmpty,
      ellipsis: !this.isActive,
    });
    return html`<div class="affine-components-description">
      <rich-text
        .yText=${this.descriptionText.yText}
        .enableFormat=${false}
        .readonly=${this.readonly}
        class="${classList}"
        data-block-is-components-description="true"
        description="${this.descriptionText.toString()}"
      ></rich-text>
      <div class="components-description" style="float:left;height: 0;">
        No description
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-components-description': ComponentsDescription;
  }
}
