import type { Text } from '@blocksuite/store';
import { BlockModel, defineBlockSchema } from '@blocksuite/store';

import {
  type DataViewDataTypeForComponents,
  type DataViewTypesForComponents,
  viewManagerForComponents,
} from './common/data-view.js';

export type ComponentsBlockProps = {
  views: DataViewDataTypeForComponents[];
  description: Text;
  title: Text;
};

export class ComponentsBlockModel extends BlockModel<ComponentsBlockProps> {
  getViewList() {
    return this.views;
  }

  initEmpty(type: DataViewTypesForComponents) {
    this.addView(type);
  }

  initTemplate(type: DataViewTypesForComponents) {
    this.page.transact(() => {
      this.page.addBlock(
        'affine:paragraph',
        {
          text: new this.page.Text(`Ceci est un test`),
        },
        this.id
      );
    });
    this.initEmpty(type);
  }

  addView(type: DataViewTypesForComponents) {
    const id = this.page.generateBlockId();
    const viewConfig = viewManagerForComponents.getView(type);
    const view = viewConfig.init(this, id, viewConfig.defaultName);
    this.page.transact(() => {
      this.views.push(view);
    });
    return view;
  }

  duplicateView(id: string): string {
    const newId = this.page.generateBlockId();
    this.page.transact(() => {
      const index = this.views.findIndex(v => v.id === id);
      const view = this.views[index];
      if (view) {
        this.views.splice(
          index + 1,
          0,
          JSON.parse(JSON.stringify({ ...view, id: newId }))
        );
      }
    });
    return newId;
  }

  deleteView(id: string) {
    this.page.captureSync();
    this.page.transact(() => {
      this.views = this.views.filter(v => v.id !== id);
    });
  }

  moveViewTo(id: string) {
    this.page.captureSync();
    this.page.transact(() => {
      const index = this.views.findIndex(v => v.id === id);
      const view = this.views[index];
      if (view) {
        this.views.splice(index, 1);
        this.views.unshift(view);
      }
    });
    this.applyViewsUpdate();
  }

  updateView(
    id: string,
    update: (
      data: DataViewDataTypeForComponents
    ) => Partial<DataViewDataTypeForComponents>
  ) {
    this.page.transact(() => {
      this.views = this.views.map(v => {
        if (v.id !== id) {
          return v;
        }
        return { ...v, ...update(v) } as DataViewDataTypeForComponents;
      });
    });
    this.applyViewsUpdate();
  }

  applyViewsUpdate() {
    this.page.updateBlock(this, {
      views: this.views,
    });
  }
}

export const ComponentsBlockSchema = defineBlockSchema({
  flavour: 'affine:components',
  props: (internal): ComponentsBlockProps => ({
    views: [],
    description: internal.Text(),
    title: internal.Text(),
  }),
  metadata: {
    role: 'hub',
    version: 1,
    parent: ['affine:note'],
    children: ['affine:paragraph', 'affine:components'],
  },
  toModel: () => new ComponentsBlockModel(),
});
