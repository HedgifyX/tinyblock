import { viewManagerForComponents } from '../common/data-view.js';

declare global {
  interface DataViewDataTypeMapForComponents {
    shortText: ShortTextViewData;
  }
}

export type ShortTextViewData = {
  text: string;
  style: {
    fontSize: number;
    color: string;
  };
};

viewManagerForComponents.register('shortText', {
  defaultName: 'Short Text View',
  init(_model, id, name) {
    return {
      id,
      name,
      mode: 'shortText',
      label: '',
      description: '',
      help: '',
      isRequired: false,
      text: '',
      style: {
        fontSize: 14,
        color: '#000000',
      },
    };
  },
});
