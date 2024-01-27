import { Slot } from '@blocksuite/global/utils';

import type {
  DataSourceForComponents,
  DetailSlotsForComponents,
} from './datasource/base.js';

export interface DataViewManagerForComponents {
  get id(): string;
  get type(): string;
  get readonly(): boolean;
  slots: {
    update: Slot;
  };

  duplicateView(): void;
  deleteView(): void;

  get isDeleted(): boolean;

  get detailSlots(): DetailSlotsForComponents;
}

export abstract class BaseDataViewManagerForComponents
  implements DataViewManagerForComponents
{
  protected constructor(protected dataSource: DataSourceForComponents) {
    this.dataSource.slots.update.pipe(this.slots.update);
  }

  get readonly(): boolean {
    return false;
  }

  public slots = {
    update: new Slot(),
  };

  public abstract get id(): string;

  public abstract get type(): string;

  public abstract deleteView(): void;

  public abstract get isDeleted(): boolean;

  public get detailSlots(): DetailSlotsForComponents {
    return this.dataSource.detailSlots;
  }
  public abstract duplicateView(): void;
}
