import type { Slot } from '@blocksuite/store';

import type { UniComponent } from '../../../_common/components/uni-component/uni-component.js';
import type { DataViewManagerForComponents } from '../data-view-manager.js';

export type DetailSlotPropsForComponents = {
  view: DataViewManagerForComponents;
};

export interface DetailSlotsForComponents {
  header?: UniComponent<DetailSlotPropsForComponents>;
}

export interface DataSourceForComponents {
  propertyGetName: (propertyId: string) => string;
  propertyGetType: (propertyId: string) => string;
  propertyGetData: (propertyId: string) => Record<string, unknown>;
  propertyGetReadonly: (columnId: string) => boolean;

  slots: {
    update: Slot;
  };

  detailSlots: DetailSlotsForComponents;
}

export abstract class BaseDataSourceForComponents
  implements DataSourceForComponents
{
  public abstract propertyGetData(propertyId: string): Record<string, unknown>;

  public propertyGetReadonly(_propertyId: string): boolean {
    return false;
  }

  public abstract propertyGetName(propertyId: string): string;

  public abstract propertyGetType(propertyId: string): string;

  public abstract slots: {
    update: Slot;
  };

  public captureSync(): void {
    //
  }

  public get detailSlots(): DetailSlotsForComponents {
    return {};
  }
}

export type ComponentsBlockDatasourceConfig = {
  type: 'components-block';
  pageId: string;
  blockId: string;
};
export type AllPageDatasourceConfigForComponents = {
  type: 'all-pages';
};
export type TagsDatasourceConfigForComponents = {
  type: 'tags';
};
export type DataSourceConfigForComponents =
  | ComponentsBlockDatasourceConfig
  | AllPageDatasourceConfigForComponents
  | TagsDatasourceConfigForComponents;
export type GetConfig<
  K extends DataSourceConfigForComponents['type'],
  T = DataSourceConfigForComponents,
> = T extends {
  type: K;
}
  ? T
  : never;
