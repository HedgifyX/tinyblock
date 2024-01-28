import { viewManagerForComponents } from '../common/data-view.js';

declare global {
  interface DataViewDataTypeMapForComponents {
    attachment: AttachmentViewData;
  }
}

export type AttachmentViewData = {
  file: string;
};

viewManagerForComponents.register('attachment', {
  defaultName: 'Attachment View',
  init(_model, id, name) {
    return {
      id,
      name,
      mode: 'attachment',
      label: '',
      description: '',
      help: '',
      isRequired: false,
      file: '',
    };
  },
});
