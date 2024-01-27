import type {
  BlockStdScope,
  EventName,
  UIEventHandler,
} from '@blocksuite/block-std';
import type { Page, Slot } from '@blocksuite/store';

import type { UniComponent } from '../../_common/components/uni-component/uni-component.js';
import type { DataViewSelection } from '../../_common/types.js';
import type { ComponentsBlockModel } from '../components-model.js';
import type { DataViewManagerForComponents } from './data-view-manager.js';

export type DataViewHeaderComponentPropForComponents<
  T extends DataViewManagerForComponents = DataViewManagerForComponents,
> = UniComponent<{ viewMethods: DataViewExposeForComponents; view: T }>;

export type DataViewPropsForComponents<
  T extends DataViewManagerForComponents = DataViewManagerForComponents,
  Selection extends DataViewSelection = DataViewSelection,
> = {
  header?: DataViewHeaderComponentPropForComponents<T>;

  view: T;

  bindHotkey: (hotkeys: Record<string, UIEventHandler>) => Disposable;

  handleEvent: (name: EventName, handler: UIEventHandler) => Disposable;

  setSelection: (selection?: Selection) => void;

  selectionUpdated: Slot<Selection | undefined>;

  onDrag?: (evt: MouseEvent, id: string) => () => void;

  getFlag?: Page['awarenessStore']['getFlag'];

  std: BlockStdScope;
};

export interface DataViewExposeForComponents {
  getSelection?(): DataViewSelection | undefined;

  focus(): void;

  showIndicator?(evt: MouseEvent): boolean;

  hideIndicator?(): void;

  moveTo?(id: string, evt: MouseEvent): void;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DataViewDataTypeMapForComponents {}
}

type CommonViewDataTypeForComponents = {
  id: string;
  name: string;
  label: string;
  description: string;
  help: string;
  isRequired: boolean;
};

export type RealDataViewDataTypeMapForComponents = {
  [K in keyof DataViewDataTypeMapForComponents]: DataViewDataTypeMapForComponents[K] &
    CommonViewDataTypeForComponents & {
      mode: K;
    };
};

export type DefaultViewDataTypeForComponents =
  CommonViewDataTypeForComponents & { mode: string };

type FallBack<T> = [T] extends [never] ? DefaultViewDataTypeForComponents : T;

export type DataViewDataTypeForComponents = FallBack<
  RealDataViewDataTypeMapForComponents[keyof RealDataViewDataTypeMapForComponents]
>;

export type DataViewTypesForComponents = DataViewDataTypeForComponents['mode'];

export interface DataViewConfigForComponents<
  Data extends DataViewDataTypeForComponents = DataViewDataTypeForComponents,
> {
  type: DataViewTypesForComponents;
  defaultName: string;
  init(model: ComponentsBlockModel, id: string, name: string): Data;
}

export type DataViewToolsPropsForComponents<
  Manager extends DataViewManagerForComponents = DataViewManagerForComponents,
> = {
  view: Manager;
  viewMethod: DataViewExposeForComponents;
};

export interface DataViewRendererConfigForComponents<
  _Data extends DataViewDataTypeForComponents = DataViewDataTypeForComponents,
> {
  type: DataViewTypesForComponents;
  view: UniComponent<DataViewPropsForComponents, DataViewExposeForComponents>;
  icon: UniComponent;
  tools?: UniComponent<DataViewToolsPropsForComponents>[];
}

export class ViewManagerForComponents {
  private map = new Map<string, DataViewConfigForComponents>();

  getView(type: string): DataViewConfigForComponents {
    const view = this.map.get(type);
    if (!view) {
      throw new Error(`${type} is not exist`);
    }
    return view;
  }

  register<Type extends keyof RealDataViewDataTypeMapForComponents>(
    type: Type,
    config: Omit<
      DataViewConfigForComponents<RealDataViewDataTypeMapForComponents[Type]>,
      'type'
    >
  ) {
    this.map.set(type, { ...config, type });
  }

  get all() {
    return Array.from(this.map.values());
  }
}

export const viewManagerForComponents = new ViewManagerForComponents();

export class ViewRendererManagerForComponents {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map = new Map<string, DataViewRendererConfigForComponents>();

  getView(type: string): DataViewRendererConfigForComponents {
    const view = this.map.get(type);
    if (!view) {
      throw new Error(`${type} is not exist`);
    }
    return view;
  }

  register<Type extends keyof RealDataViewDataTypeMapForComponents>(
    type: Type,
    config: Omit<
      DataViewRendererConfigForComponents<
        RealDataViewDataTypeMapForComponents[Type]
      >,
      'type'
    >
  ) {
    this.map.set(type, {
      ...config,
      type,
    });
  }

  get all() {
    return Array.from(this.map.values());
  }
}

export const viewRendererManagerForComponents =
  new ViewRendererManagerForComponents();
