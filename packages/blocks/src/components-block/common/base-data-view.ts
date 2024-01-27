import type {
  BlockStdScope,
  EventName,
  UIEventHandler,
} from '@blocksuite/block-std';
import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import type { Page, Slot } from '@blocksuite/store';
import { property } from 'lit/decorators.js';

import type { UniComponent } from '../../_common/components/uni-component/uni-component.js';
import type { DataViewSelection } from '../../_common/utils/index.js';
import type {
  DataViewExposeForComponents,
  DataViewPropsForComponents,
} from './data-view.js';
import type { DataViewManagerForComponents } from './data-view-manager.js';

export abstract class BaseDataViewForComponents<
    T extends DataViewManagerForComponents = DataViewManagerForComponents,
    Selection extends DataViewSelection = DataViewSelection,
  >
  extends WithDisposable(ShadowlessElement)
  implements
    DataViewPropsForComponents<T, Selection>,
    DataViewExposeForComponents
{
  @property({ attribute: false })
  std!: BlockStdScope;

  @property({ attribute: false })
  header!: UniComponent<{ viewMethods: DataViewExposeForComponents; view: T }>;

  @property({ attribute: false })
  view!: T;

  @property({ attribute: false })
  bindHotkey!: (hotkeys: Record<string, UIEventHandler>) => Disposable;

  @property({ attribute: false })
  handleEvent!: (name: EventName, handler: UIEventHandler) => Disposable;

  @property({ attribute: false })
  modalMode?: boolean;

  @property({ attribute: false })
  setSelection!: (selection?: Selection) => void;

  @property({ attribute: false })
  selectionUpdated!: Slot<Selection | undefined>;

  @property({ attribute: false })
  onDrag?: (evt: MouseEvent, id: string) => () => void;

  @property({ attribute: false })
  getFlag!: Page['awarenessStore']['getFlag'];

  abstract focusInputText(): void;
  abstract getSelection(): Selection | undefined;
}
