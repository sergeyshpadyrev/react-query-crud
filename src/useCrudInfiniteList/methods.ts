import { CrudInfiniteListMethodOptions } from './types';

export const CrudInfiniteListMethods = {
  create: <
    Id,
    Item extends { id: Id },
    ItemCreateData,
    Page extends { items: Item[] }
  >(
    run: (variables: ItemCreateData) => Promise<Page>
  ) =>
    ({
      name: 'create',
      run,
      update: (pages: Page[], result: Page) => [result, ...pages],
    } as CrudInfiniteListMethodOptions<
      ItemCreateData,
      Id,
      Item,
      'create',
      Page,
      Page
    >),
};
