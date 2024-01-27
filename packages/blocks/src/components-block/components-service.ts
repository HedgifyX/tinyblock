import { BlockService } from '@blocksuite/block-std';
import { assertExists } from '@blocksuite/global/utils';
import type { BlockModel, Page } from '@blocksuite/store';

import { InlineManager } from '../_common/inline/inline-manager.js';
import {
  type AffineTextAttributes,
  getAffineInlineSpecsWithReference,
} from '../_common/inline/presets/affine-inline-specs.js';
import { affineInlineMarkdownMatches } from '../_common/inline/presets/markdown.js';
import { ReferenceNodeConfig } from '../_common/inline/presets/nodes/reference-node/reference-config.js';
import type { DataViewTypesForComponents } from './common/data-view.js';
import { ComponentsSelection } from './common/selection.js';
import type { ComponentsBlockModel } from './components-model.js';

export class ComponentsService<
  TextAttributes extends AffineTextAttributes = AffineTextAttributes,
> extends BlockService<ComponentsBlockModel> {
  readonly inlineManager = new InlineManager<TextAttributes>();
  readonly referenceNodeConfig = new ReferenceNodeConfig();

  override mounted(): void {
    super.mounted();
    this.selectionManager.register(ComponentsSelection);

    this.handleEvent('selectionChange', () => true);

    this.referenceNodeConfig.setPage(this.page);

    const inlineSpecs = getAffineInlineSpecsWithReference(
      this.referenceNodeConfig
    );
    this.inlineManager.registerSpecs(inlineSpecs);
    this.inlineManager.registerMarkdownMatches(affineInlineMarkdownMatches);
  }

  initComponentsBlock(
    page: Page,
    model: BlockModel,
    componentsId: string,
    viewType: DataViewTypesForComponents,
    isAppendNewRow = true
  ) {
    const blockModel = page.getBlockById(componentsId) as ComponentsBlockModel;
    assertExists(blockModel);
    blockModel.initTemplate(viewType);
    if (isAppendNewRow) {
      // Add a paragraph after database
      const parent = page.getParent(model);
      assertExists(parent);
      page.addBlock('affine:paragraph', {}, parent.id);
    }
  }
}
