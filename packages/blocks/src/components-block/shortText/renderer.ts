import { createIcon } from '../../_common/components/icon/uni-icon.js';
import { createUniComponentFromWebComponent } from '../../_common/components/uni-component/uni-component.js';
import { viewRendererManagerForComponents } from '../common/data-view.js';
import { DataViewShortText } from './shortText-view.js';

viewRendererManagerForComponents.register('shortText', {
  view: createUniComponentFromWebComponent(DataViewShortText),
  icon: createIcon('ShortTextIcon'),
  tools: [
    // createUniComponentFromWebComponent(DataViewHeaderToolsFilter),
    // createUniComponentFromWebComponent(ExpandDatabaseBlockModal),
    // createUniComponentFromWebComponent(DataViewHeaderToolsSearch),
    // createUniComponentFromWebComponent(DataViewHeaderToolsViewOptions),
    // createUniComponentFromWebComponent(DataViewHeaderToolsAddRow),
  ],
});
