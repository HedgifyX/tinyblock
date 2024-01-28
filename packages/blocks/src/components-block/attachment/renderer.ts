import { createIcon } from '../../_common/components/icon/uni-icon.js';
import { createUniComponentFromWebComponent } from '../../_common/components/uni-component/uni-component.js';
import { viewRendererManagerForComponents } from '../common/data-view.js';
import { DataViewAttachment } from './attachment-view.js';

viewRendererManagerForComponents.register('attachment', {
  view: createUniComponentFromWebComponent(DataViewAttachment),
  icon: createIcon('AttachmentIcon'),
  tools: [
    // createUniComponentFromWebComponent(DataViewHeaderToolsFilter),
    // createUniComponentFromWebComponent(ExpandDatabaseBlockModal),
    // createUniComponentFromWebComponent(DataViewHeaderToolsSearch),
    // createUniComponentFromWebComponent(DataViewHeaderToolsViewOptions),
    // createUniComponentFromWebComponent(DataViewHeaderToolsAddRow),
  ],
});
