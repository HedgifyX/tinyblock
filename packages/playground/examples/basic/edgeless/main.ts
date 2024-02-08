// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import '@vanillahill99/presets/themes/affine.css';

import { createEmptyPage, EdgelessEditor } from '@vanillahill99/presets';

const page = await createEmptyPage().init();
const editor = new EdgelessEditor();
editor.page = page;
document.body.appendChild(editor);
