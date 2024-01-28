import type { RealDataViewDataTypeMapForComponents } from '../common/data-view.js';
import { BaseDataViewManagerForComponents } from '../common/data-view-manager.js';
import type { DataSourceForComponents } from '../common/datasource/base.js';
import type { SingleViewSourceForComponents } from '../common/view-source.js';

type AttachmentViewData = RealDataViewDataTypeMapForComponents['attachment'];

export class DataViewAttachmentManager extends BaseDataViewManagerForComponents {
  public override get type(): string {
    return this.view.mode;
  }

  private readonly updateView: (
    updater: (view: AttachmentViewData) => Partial<AttachmentViewData>
  ) => void;

  constructor(
    private viewSource: SingleViewSourceForComponents<AttachmentViewData>,
    dataSource: DataSourceForComponents
  ) {
    super(dataSource);
    this.updateView = updater => {
      viewSource.updateView(updater);
    };
    viewSource.updateSlot.pipe(this.slots.update);
  }

  get view() {
    return this.viewSource.view;
  }

  get id() {
    return this.view.id;
  }

  get name(): string {
    return this.view.name;
  }

  updateName(name: string): void {
    this.updateView(() => {
      return {
        name,
      };
    });
  }
  override get readonly(): boolean {
    return this.viewSource.readonly;
  }

  public duplicateView(): void {
    this.viewSource.duplicate();
  }
  public deleteView(): void {
    this.viewSource.delete();
  }

  public get isDeleted(): boolean {
    return this.viewSource.isDeleted();
  }

  public get label() {
    return this.view.label;
  }

  public updateLabel(label: string) {
    this.updateView(() => {
      return {
        label,
      };
    });
  }

  public get description() {
    return this.view.description;
  }

  public updateDescription(description: string) {
    this.updateView(() => {
      return {
        description,
      };
    });
  }

  public get help() {
    return this.view.help;
  }

  public updateHelp(help: string) {
    this.updateView(() => {
      return {
        help,
      };
    });
  }

  public get isRequired() {
    return this.view.isRequired;
  }

  public updateIsRequired(isRequired: boolean) {
    this.updateView(() => {
      return {
        isRequired,
      };
    });
  }
}
