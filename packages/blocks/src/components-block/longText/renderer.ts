import { createIcon } from '../../_common/components/icon/uni-icon.js';
import { createUniComponentFromWebComponent } from '../../_common/components/uni-component/uni-component.js';
import { viewRendererManagerForComponents } from '../common/data-view.js';
import { DataViewLongText } from './longText-view.js';

viewRendererManagerForComponents.register('longText', {
  view: createUniComponentFromWebComponent(DataViewLongText),
  icon: createIcon('LongTextIcon'),
  tools: [
    // createUniComponentFromWebComponent(DataViewHeaderToolsFilter),
    // createUniComponentFromWebComponent(ExpandDatabaseBlockModal),
    // createUniComponentFromWebComponent(DataViewHeaderToolsSearch),
    // createUniComponentFromWebComponent(DataViewHeaderToolsViewOptions),
    // createUniComponentFromWebComponent(DataViewHeaderToolsAddRow),
  ],
});
