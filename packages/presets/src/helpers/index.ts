import { Schema, Workspace } from '@blocksuite/store';
import { AffineSchemas } from '@vanillahill99/blocks/models';

export function createEmptyPage() {
  const schema = new Schema().register(AffineSchemas);
  const workspace = new Workspace({ schema });
  const page = workspace.createPage();

  return {
    page,
    async init() {
      await page.load(() => {
        const pageBlockId = page.addBlock('affine:page', {});
        page.addBlock('affine:surface', {}, pageBlockId);
        const noteId = page.addBlock('affine:note', {}, pageBlockId);
        page.addBlock('affine:paragraph', {}, noteId);
      });
      return page;
    },
  };
}
