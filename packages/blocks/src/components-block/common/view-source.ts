import type { Slot } from '@blocksuite/global/utils';

import type {
  DataViewDataTypeForComponents,
  DataViewTypesForComponents,
} from './data-view.js';

export interface SingleViewSourceForComponents<
  View extends DataViewDataTypeForComponents = DataViewDataTypeForComponents,
> {
  readonly view: View;
  readonly updateView: (updater: (view: View) => Partial<View>) => void;

  delete(): void;

  get readonly(): boolean;

  updateSlot: Slot;

  isDeleted(): boolean;
  duplicate(): void;
}

export interface ViewSourceForComponents {
  get readonly(): boolean;
  get currentViewId(): string;
  get currentView(): SingleViewSourceForComponents;
  selectView: (id: string) => void;
  views: SingleViewSourceForComponents[];
  viewGet(id: string): SingleViewSourceForComponents;
  viewAdd(type: DataViewTypesForComponents): string;
  updateSlot: Slot;

  moveTo(id: string): void;
  duplicate(id: string): void;
}
