/* eslint-disable @typescript-eslint/no-explicit-any */
// related component
import './common/header/title.js';
import './common/header/description.js';
import './data-view.js';

import { PathFinder, type UIEventHandler } from '@blocksuite/block-std';
import { BlockElement } from '@blocksuite/lit';
import { Slice, Slot } from '@blocksuite/store';
import { css, html, nothing, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';

import { DragIndicator } from '../_common/components/index.js';
import { popMenu } from '../_common/components/menu/index.js';
import { defineUniComponent } from '../_common/components/uni-component/uni-component.js';
import {
  CopyIcon,
  DeleteIcon,
  MoreHorizontalIcon,
} from '../_common/icons/index.js';
import { type DataViewSelection, Rect } from '../_common/utils/index.js';
import { AffineDragHandleWidget } from '../index.js';
import {
  captureEventTarget,
  getDropResult,
} from '../page-block/widgets/drag-handle/utils.js';
import { dataViewCommonStyle } from './common/css-variable.js';
import type {
  DataViewExposeForComponents,
  DataViewTypesForComponents,
} from './common/data-view.js';
import type { DataViewManagerForComponents } from './common/data-view-manager.js';
import type { DataSourceForComponents } from './common/datasource/base.js';
import { ComponentsBlockDatasource } from './common/datasource/components-block-datasource.js';
import { ComponentsSelection } from './common/selection.js';
import type {
  SingleViewSourceForComponents,
  ViewSourceForComponents,
} from './common/view-source.js';
import {
  type ComponentsBlockModel,
  ComponentsBlockSchema,
} from './components-model.js';
import type { ComponentsService } from './components-service.js';
import type {
  DataViewNativeConfigForComponents,
  DataViewNativeForComponents,
} from './data-view.js';

@customElement('affine-components')
export class ComponentsBlockComponent extends BlockElement<
  ComponentsBlockModel,
  ComponentsService
> {
  static override styles = css`
    ${unsafeCSS(dataViewCommonStyle('affine-components'))}
    affine-components {
      display: block;
      border-radius: 8px;
      background-color: var(--affine-background-primary-color);
      padding: 8px;
      margin: 8px -8px -8px;
    }

    .components-block-selected {
      background-color: var(--affine-hover-color);
      border-radius: 4px;
    }
    .components-ops {
      margin-top: 4px;
      padding: 2px;
      border-radius: 4px;
      display: flex;
      cursor: pointer;
    }
    .components-ops svg {
      width: 16px;
      height: 16px;
      color: var(--affine-icon-color);
    }
    .components-ops:hover {
      background-color: var(--affine-hover-color);
    }
  `;
  indicator = new DragIndicator();
  onDrag = (evt: MouseEvent, id: string): (() => void) => {
    const result = getDropResult(evt);
    if (result && result.rect) {
      document.body.append(this.indicator);
      this.indicator.rect = Rect.fromLWTH(
        result.rect.left,
        result.rect.width,
        result.rect.top,
        result.rect.height
      );
      return () => {
        this.indicator.remove();
        const model = this.page.getBlockById(id);
        const target = this.page.getBlockById(result.dropBlockId);
        let parent = this.page.getParent(result.dropBlockId);
        const shouldInsertIn = result.dropType === 'in';
        if (shouldInsertIn) {
          parent = target;
        }
        if (model && target && parent) {
          if (shouldInsertIn) {
            this.page.moveBlocks([model], parent);
          } else {
            this.page.moveBlocks(
              [model],
              parent,
              target,
              result.dropType === 'before'
            );
          }
        }
      };
    }
    this.indicator.remove();
    return () => {};
  };
  private _clickComponentsOps = (e: MouseEvent) => {
    popMenu(e.currentTarget as HTMLElement, {
      options: {
        input: {
          initValue: this.model.title.toString(),
          placeholder: 'Untitled',
          onComplete: text => {
            this.model.title.replace(0, this.model.title.length, text);
          },
        },
        items: [
          {
            type: 'action',
            icon: CopyIcon,
            name: 'Copy',
            select: () => {
              const slice = Slice.fromModels(this.page, [this.model]);
              this.std.clipboard.copySlice(slice).catch(console.error);
            },
          },
          {
            type: 'group',
            name: '',
            children: () => [
              {
                type: 'action',
                icon: DeleteIcon,
                class: 'delete-item',
                name: 'Delete Component',
                select: () => {
                  this.model.children.slice().forEach(block => {
                    this.page.deleteBlock(block);
                  });
                  this.page.deleteBlock(this.model);
                },
              },
            ],
          },
        ],
      },
    });
  };
  private renderComponentsOps() {
    if (this.page.readonly) {
      return nothing;
    }
    return html`<div
      class="components-ops"
      @click="${this._clickComponentsOps}"
    >
      ${MoreHorizontalIcon}
    </div>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._disposables.add(
      this.selection.slots.changed.on(selections => {
        const componentsSelection = selections.find(
          (selection): selection is ComponentsSelection => {
            if (!PathFinder.equals(selection.path, this.path)) {
              return false;
            }
            return selection instanceof ComponentsSelection;
          }
        );
        this.selectionUpdated.emit(componentsSelection?.viewSelection);
      })
    );
    this._disposables.add(
      this.model.propsUpdated.on(() => {
        this.viewSource.updateSlot.emit();
      })
    );
    this.handleEvent('selectionChange', () => {
      const selection = this.service?.selectionManager.value.find(selection =>
        PathFinder.equals(selection.path, this.path)
      );
      return !!selection;
    });
    let canDrop = false;
    this.disposables.add(
      AffineDragHandleWidget.registerOption({
        flavour: ComponentsBlockSchema.model.flavour,
        onDragMove: state => {
          const target = captureEventTarget(state.raw.target);
          const view = this.view;
          if (view && target instanceof HTMLElement && this.contains(target)) {
            canDrop = view.showIndicator?.(state.raw) ?? false;
            return false;
          }
          if (canDrop) {
            view?.hideIndicator?.();
            canDrop = false;
          }
          return false;
        },
        onDragEnd: ({ state, draggingElements }) => {
          const target = state.raw.target;
          const view = this.view;
          if (
            canDrop &&
            view &&
            view.moveTo &&
            target instanceof HTMLElement &&
            this.parentElement?.contains(target)
          ) {
            const blocks = draggingElements.map(v => v.model);
            this.model.page.moveBlocks(blocks, this.model);
            blocks.forEach(model => {
              view.moveTo?.(model.id, state.raw);
            });
            view.hideIndicator?.();
            return false;
          }
          if (canDrop) {
            view?.hideIndicator?.();
            canDrop = false;
          }
          return false;
        },
      })
    );
  }

  private _view = createRef<DataViewNativeForComponents>();

  get view() {
    return this._view.value?.expose;
  }

  private _dataSource?: DataSourceForComponents;
  public get dataSource(): DataSourceForComponents {
    if (!this._dataSource) {
      this._dataSource = new ComponentsBlockDatasource(this.host, {
        type: 'components-block',
        pageId: this.host.page.id,
        blockId: this.model.id,
      });
    }
    return this._dataSource;
  }

  public focusInputText = () => {
    this._view.value?.focus();
  };

  private renderDescription = () => {
    return html` <affine-components-description
      style="overflow: hidden"
      .descriptionText="${this.model.description}"
      .readonly="${this.model.page.readonly}"
      .onPressEnterKey="${() => {}}"
    ></affine-components-description>`;
  };
  private renderTitle = (_dataViewMethod: DataViewExposeForComponents) => {
    return html` <affine-components-title
      style="overflow: hidden"
      .titleText="${this.model.title}"
      .readonly="${this.model.page.readonly}"
      .onPressEnterKey="${() => {}}"
    ></affine-components-title>`;
  };
  private renderReference = () => {
    return html` <div></div>`;
  };

  headerComponent = defineUniComponent(
    ({
      viewMethods,
    }: {
      view: DataViewManagerForComponents;
      viewMethods: DataViewExposeForComponents;
    }) => {
      return html`
        <div style="margin-bottom: 8px;display:flex;flex-direction: column">
          <div style="display:flex;gap:8px;padding: 0 6px;margin-bottom: 8px;">
            ${this.renderTitle(viewMethods)} ${this.renderComponentsOps()}
            ${this.renderReference()}
          </div>
          <div
            style="display:flex;align-items:center;justify-content: space-between;gap: 12px"
          >
            ${this.renderDescription()}
          </div>
        </div>
      `;
    }
  );

  private _descriptionSource?: ViewSourceForComponents;
  public get viewSource(): ViewSourceForComponents {
    if (!this._descriptionSource) {
      this._descriptionSource = new ComponentsBlockViewSource(this.model);
    }
    return this._descriptionSource;
  }

  setSelection = (selection: DataViewSelection | undefined) => {
    this.selection.setGroup(
      'note',
      selection
        ? [
            new ComponentsSelection({
              path: this.path,
              viewSelection: selection,
            }),
          ]
        : []
    );
  };
  selectionUpdated = new Slot<DataViewSelection | undefined>();

  get getFlag() {
    return this.host.page.awarenessStore.getFlag.bind(
      this.host.page.awarenessStore
    );
  }

  // _bindHotkey: DataViewPropsForComponents['bindHotkey'] = hotkeys => {
  //   return {
  //     dispose: this.host.event.bindHotkey(hotkeys, {
  //       path: this.path,
  //     }),
  //   };
  // };
  // _handleEvent: DataViewPropsForComponents['handleEvent'] = (name, handler) => {
  //   return {
  //     dispose: this.host.event.add(name, handler, {
  //       path: this.path,
  //     }),
  //   };
  // };

  override render() {
    const config: DataViewNativeConfigForComponents = {
      // bindHotkey: this._bindHotkey,
      // handleEvent: this._handleEvent,
      getFlag: this.getFlag,
      selectionUpdated: this.selectionUpdated,
      setSelection: this.setSelection,
      dataSource: this.dataSource,
      viewSource: this.viewSource,
      headerComponent: this.headerComponent,
      onDrag: this.onDrag,
      std: this.std,
      bindHotkey: function (_hotkeys: any): Disposable {
        throw new Error('Function not implemented.');
      },
      handleEvent: function (_name: any, _handler: UIEventHandler): Disposable {
        throw new Error('Function not implemented.');
      },
    };
    return html`
      <div style="position: relative">
        <affine-data-view-native-components
          ${ref(this._view)}
          .config="${config}"
        ></affine-data-view-native-components>
        ${when(
          this.selected?.is('block'),
          () =>
            html` <affine-block-selection
              style="z-index: 1"
            ></affine-block-selection>`
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-components': ComponentsBlockComponent;
  }
}

class ComponentsBlockViewSource implements ViewSourceForComponents {
  constructor(private model: ComponentsBlockModel) {}

  get currentViewId(): string {
    return this.currentId ?? this.model.views[0].id;
  }

  private viewMap = new Map<string, SingleViewSourceForComponents>();
  private currentId?: string;

  public selectView(id: string): void {
    this.currentId = id;
    this.updateSlot.emit();
  }

  public updateSlot = new Slot();

  public get views(): SingleViewSourceForComponents[] {
    return this.model.views.map(v => this.viewGet(v.id));
  }

  public get currentView(): SingleViewSourceForComponents {
    return this.viewGet(this.currentViewId);
  }

  public get readonly(): boolean {
    return this.model.page.readonly;
  }

  public viewAdd(type: DataViewTypesForComponents): string {
    this.model.page.captureSync();
    const view = this.model.addView(type);
    this.model.applyViewsUpdate();
    return view.id;
  }

  public viewGet(id: string): SingleViewSourceForComponents {
    let result = this.viewMap.get(id);
    if (!result) {
      const getView = () => {
        return this.model.views.find(v => v.id === id);
      };
      const view = getView();
      if (!view) {
        throw new Error('view not found');
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      const slot = new Slot();
      this.updateSlot.pipe(slot);
      result = {
        duplicate(): void {
          self.duplicate(id);
        },
        get view() {
          const view = getView();
          if (!view) {
            throw new Error('view not found');
          }
          return view;
        },
        updateView: updater => {
          this.model.page.captureSync();
          this.model.updateView(id, updater);
          this.model.applyViewsUpdate();
        },
        delete: () => {
          this.model.page.captureSync();
          this.model.deleteView(id);
          this.currentId = undefined;
          this.model.applyViewsUpdate();
        },
        get readonly() {
          return self.model.page.readonly;
        },
        updateSlot: slot,
        isDeleted() {
          return !self.model.views.find(v => v.id === id);
        },
      };
      this.viewMap.set(id, result);
    }
    return result;
  }

  public duplicate(id: string): void {
    const newId = this.model.duplicateView(id);
    this.selectView(newId);
  }

  public moveTo(id: string): void {
    this.model.moveViewTo(id);
  }
}
