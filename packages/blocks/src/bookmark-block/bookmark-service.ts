import { BlockService } from '@blocksuite/block-std';

import type { BookmarkBlockModel } from './bookmark-model.js';
import {
  queryUrlDataFromAffineWorker,
  setLinkPreviewEndpoint,
} from './utils.js';

export class BookmarkService extends BlockService<BookmarkBlockModel> {
  queryUrlData = (url: string) => {
    return queryUrlDataFromAffineWorker(url);
  };

  setLinkPreviewEndpoint = setLinkPreviewEndpoint;
}
