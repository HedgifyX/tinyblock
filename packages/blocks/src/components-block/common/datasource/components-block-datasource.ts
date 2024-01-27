import { Slot } from '@blocksuite/global/utils';
import type { EditorHost } from '@blocksuite/lit';
import type { BlockModel } from '@blocksuite/store';

import { createUniComponentFromWebComponent } from '../../../_common/components/uni-component/uni-component.js';
import type { ComponentsBlockModel } from '../../components-model.js';
import {
  BaseDataSourceForComponents,
  type ComponentsBlockDatasourceConfig,
  type DetailSlotsForComponents,
} from './base.js';
import { BlockRendererForComponents } from './block-renderer.js';

export class ComponentsBlockDatasource extends BaseDataSourceForComponents {
  private _model: ComponentsBlockModel;
  private _batch = 0;

  get page() {
    return this._model.page;
  }

  constructor(
    private host: EditorHost,
    config: ComponentsBlockDatasourceConfig
  ) {
    super();
    this._model = host.page.workspace
      .getPage(config.pageId)
      ?.getBlockById(config.blockId) as ComponentsBlockModel;
    this._model.childrenUpdated.pipe(this.slots.update);
  }

  public slots = {
    update: new Slot(),
  };

  private _runCapture() {
    if (this._batch) {
      return;
    }

    this._batch = requestAnimationFrame(() => {
      this.page.captureSync();
      this._batch = 0;
    });
  }

  private getModelById(rowId: string): BlockModel | undefined {
    return this._model.children[this._model.childMap.get(rowId) ?? -1];
  }

  public propertyGetData(_propertyId: string): Record<string, unknown> {
    //return this._model.columns.find(v => v.id === propertyId)?.data ?? {};
    return {};
  }

  public override propertyGetReadonly(propertyId: string): boolean {
    if (propertyId === 'type') return true;
    return false;
  }

  public propertyGetName(propertyId: string): string {
    if (propertyId === 'type') {
      return 'Block Type';
    }
    //return this._model.columns.find(v => v.id === propertyId)?.name ?? '';
    return '';
  }

  public propertyGetType(propertyId: string): string {
    if (propertyId === 'type') {
      return 'image';
    }
    //return this._model.columns.find(v => v.id === propertyId)?.type ?? '';
    return '';
  }
  public override captureSync(): void {
    this.page.captureSync();
  }

  public override get detailSlots(): DetailSlotsForComponents {
    return {
      ...super.detailSlots,
      header: createUniComponentFromWebComponent(BlockRendererForComponents),
    };
  }
}
