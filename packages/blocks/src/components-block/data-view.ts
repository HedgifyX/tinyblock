/* eslint-disable @typescript-eslint/no-explicit-any */
import './shortText/define.js';
import './shortText/renderer.js';
import './longText/define.js';
import './longText/renderer.js';

import type { BlockStdScope } from '@blocksuite/block-std';
import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import { Slot } from '@blocksuite/store';
import { css, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { keyed } from 'lit/directives/keyed.js';
import { createRef } from 'lit/directives/ref.js';

import { renderUniLit } from '../_common/components/uni-component/uni-component.js';
import type {
  DataViewSelection,
  DataViewSelectionState,
} from '../_common/utils/index.js';
import type { BaseDataViewForComponents } from './common/base-data-view.js';
import { dataViewCommonStyle } from './common/css-variable.js';
import {
  type DataViewExposeForComponents,
  type DataViewPropsForComponents,
  type DataViewTypesForComponents,
  viewRendererManagerForComponents,
} from './common/data-view.js';
import type { DataViewManagerForComponents } from './common/data-view-manager.js';
import type { DataSourceForComponents } from './common/datasource/base.js';
import type {
  SingleViewSourceForComponents,
  ViewSourceForComponents,
} from './common/view-source.js';
import { DataViewLongTextManager } from './longText/longText-view-manager.js';
import { DataViewShortTextManager } from './shortText/shortText-view-manager.js';

type ViewPropsForComponents = {
  view: DataViewManagerForComponents;
  viewUpdated: Slot;
  selectionUpdated: Slot<DataViewSelectionState>;
  setSelection: (selection?: DataViewSelectionState) => void;
  bindHotkey: BaseDataViewForComponents['bindHotkey'];
  handleEvent: BaseDataViewForComponents['handleEvent'];
};

const ViewManagerMapForComponents: Record<
  DataViewTypesForComponents,
  new (
    viewSource: SingleViewSourceForComponents<any>,
    dataSource: DataSourceForComponents
  ) => DataViewManagerForComponents
> = {
  shortText: DataViewShortTextManager,
  longText: DataViewLongTextManager,
};

export type DataViewNativeConfigForComponents = {
  bindHotkey: DataViewPropsForComponents['bindHotkey'];
  handleEvent: DataViewPropsForComponents['handleEvent'];
  getFlag?: DataViewPropsForComponents['getFlag'];
  selectionUpdated: Slot<DataViewSelection | undefined>;
  setSelection: (selection: DataViewSelection | undefined) => void;
  dataSource: DataSourceForComponents;
  viewSource: ViewSourceForComponents;
  headerComponent: DataViewPropsForComponents['header'];
  onDrag?: DataViewPropsForComponents['onDrag'];
  std: BlockStdScope;
};

@customElement('affine-data-view-native-components')
export class DataViewNativeForComponents extends WithDisposable(
  ShadowlessElement
) {
  static override styles = css`
    ${unsafeCSS(dataViewCommonStyle('affine-data-view-native-components'))}
    affine-data-view-native-components {
      background-color: var(--affine-background-primary-color);
      display: contents;
    }
  `;
  @property({ attribute: false })
  config!: DataViewNativeConfigForComponents;

  public get expose() {
    return this._view.value;
  }
  override connectedCallback() {
    super.connectedCallback();
    this.disposables.add(
      this.config.selectionUpdated.on(selection => {
        Object.entries(this.viewMap).forEach(([id, v]) => {
          if (!selection || selection.viewId !== id) {
            v.selectionUpdated.emit(undefined);
            return;
          }
          v.selectionUpdated.emit(selection);
        });
      })
    );
    this.disposables.add(
      this.config.viewSource.updateSlot.on(() => {
        this.requestUpdate();
        this.config.viewSource.views.forEach(v => {
          v.updateSlot.emit();
        });
      })
    );
  }

  @state()
  currentView?: string;

  private _view = createRef<DataViewExposeForComponents>();

  private viewMap: Record<string, ViewPropsForComponents> = {};

  public focusInputText = () => {
    this._view.value?.focus();
  };

  private getView(id: string): ViewPropsForComponents {
    if (!this.viewMap[id]) {
      const singleViewSource = this.config.viewSource.viewGet(id);

      const view = new ViewManagerMapForComponents[singleViewSource.view.mode](
        singleViewSource,
        this.config.dataSource
      );
      this.viewMap[id] = {
        view: view,
        viewUpdated: singleViewSource.updateSlot,
        selectionUpdated: new Slot<DataViewSelectionState>(),
        setSelection: selection => {
          this.config.setSelection(selection);
        },
        handleEvent: (name, handler) =>
          this.config.handleEvent(name, context => {
            if (this.config.viewSource.currentViewId === id) {
              return handler(context);
            }
          }),
        bindHotkey: hotkeys =>
          this.config.bindHotkey(
            Object.fromEntries(
              Object.entries(hotkeys).map(([key, fn]) => [
                key,
                ctx => {
                  if (this.config.viewSource.currentViewId === id) {
                    return fn(ctx);
                  }
                },
              ])
            )
          ),
      };
    }
    return this.viewMap[id];
  }

  private renderView(viewData?: ViewPropsForComponents) {
    if (!viewData) {
      return;
    }
    const props: DataViewPropsForComponents = {
      view: viewData.view,
      header: this.config.headerComponent,
      selectionUpdated: viewData.selectionUpdated,
      setSelection: viewData.setSelection,
      bindHotkey: viewData.bindHotkey,
      handleEvent: viewData.handleEvent,
      getFlag: this.config.getFlag,
      onDrag: this.config.onDrag,
      std: this.config.std,
    };
    return keyed(
      viewData.view.id,
      renderUniLit(
        viewRendererManagerForComponents.getView(viewData.view.type).view,
        props,
        { ref: this._view }
      )
    );
  }

  override render() {
    const views = this.config.viewSource.views;
    const viewData = views
      .map(view => this.getView(view.view.id))
      .find(v => v.view.id === this.config.viewSource.currentViewId);
    const containerClass = classMap({
      'toolbar-hover-container': true,
      'data-view-root': true,
    });
    return html`
      <div style="display: contents" class="${containerClass}">
        ${this.renderView(viewData)}
      </div>
    `;
  }
}
