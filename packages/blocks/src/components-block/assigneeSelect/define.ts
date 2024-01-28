import { viewManagerForComponents } from '../common/data-view.js';

declare global {
  interface DataViewDataTypeMapForComponents {
    assigneeSelect: AssigneeSelectViewData;
  }
}

export type AssigneeSelectViewData = {
  assignee: string[];
};

viewManagerForComponents.register('assigneeSelect', {
  defaultName: 'Assignee Select View',
  init(_model, id, name) {
    return {
      id,
      name,
      mode: 'assigneeSelect',
      label: '',
      description: '',
      help: '',
      isRequired: false,
      assignee: [],
    };
  },
});
