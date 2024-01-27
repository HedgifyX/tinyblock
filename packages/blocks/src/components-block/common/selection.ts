import { BaseSelection } from '@blocksuite/block-std';
import { z } from 'zod';

import type {
  DataViewSelection,
  GetDataViewSelection,
} from '../../_common/utils/index.js';

const ShortTextViewSelectionSchema = z.object({
  viewId: z.string(),
  type: z.literal('shortText'),
  isEditing: z.boolean(),
});

const ComponentsSelectionSchema = z.object({
  path: z.array(z.string()),
  viewSelection: ShortTextViewSelectionSchema,
});

export class ComponentsSelection extends BaseSelection {
  static override type = 'components';
  readonly viewSelection: DataViewSelection;

  constructor({
    path,
    viewSelection,
  }: {
    path: string[];
    viewSelection: DataViewSelection;
  }) {
    super({
      path,
    });

    this.viewSelection = viewSelection;
  }

  get viewId() {
    return this.viewSelection.viewId;
  }

  getSelection<T extends DataViewSelection['type']>(
    type: T
  ): GetDataViewSelection<T> | undefined {
    return this.viewSelection.type === type
      ? (this.viewSelection as GetDataViewSelection<T>)
      : undefined;
  }

  override equals(other: BaseSelection): boolean {
    if (!(other instanceof ComponentsSelection)) {
      return false;
    }
    return this.blockId === other.blockId;
  }

  override toJSON(): Record<string, unknown> {
    return {
      type: 'components',
      path: this.path,
      viewSelection: this.viewSelection,
    };
  }

  static override fromJSON(json: Record<string, unknown>): ComponentsSelection {
    ComponentsSelectionSchema.parse(json);
    return new ComponentsSelection({
      path: json.path as string[],
      viewSelection: json.viewSelection as DataViewSelection,
    });
  }
}

declare global {
  namespace BlockSuite {
    interface Selection {
      components: typeof ComponentsSelection;
    }
  }
}
