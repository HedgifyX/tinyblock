import { viewManagerForComponents } from '../common/data-view.js';

declare global {
  interface DataViewDataTypeMapForComponents {
    longText: LongTextViewData;
  }
}

export type LongTextViewData = {
  text: string;
  style: {
    fontSize: number;
    color: string;
  };
};

viewManagerForComponents.register('longText', {
  defaultName: 'Long Text View',
  init(_model, id, name) {
    return {
      id,
      name,
      mode: 'longText',
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
