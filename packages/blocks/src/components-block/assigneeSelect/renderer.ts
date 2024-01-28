import { createIcon } from '../../_common/components/icon/uni-icon.js';
import { createUniComponentFromWebComponent } from '../../_common/components/uni-component/uni-component.js';
import { viewRendererManagerForComponents } from '../common/data-view.js';
import { DataViewAssigneeSelect } from './assigneeSelect-view.js';

viewRendererManagerForComponents.register('assigneeSelect', {
  view: createUniComponentFromWebComponent(DataViewAssigneeSelect),
  icon: createIcon('AssigneeSelectIcon'),
  tools: [
    // createUniComponentFromWebComponent(DataViewHeaderToolsFilter),
    // createUniComponentFromWebComponent(ExpandDatabaseBlockModal),
    // createUniComponentFromWebComponent(DataViewHeaderToolsSearch),
    // createUniComponentFromWebComponent(DataViewHeaderToolsViewOptions),
    // createUniComponentFromWebComponent(DataViewHeaderToolsAddRow),
  ],
});
