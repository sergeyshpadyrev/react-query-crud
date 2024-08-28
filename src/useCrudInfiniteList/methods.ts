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
  delete: <Id, Item extends { id: Id }, Page extends { items: Item[] }>(
    run: (variables: { id: Id }) => Promise<void>
  ) =>
    ({
      name: 'delete',
      run,
      update: (pages: Page[], _result: void, { id }: { id: Id }) =>
        pages.map(page => ({
          ...page,
          items: page.items.filter(item => item.id !== id),
        })),
    } as CrudInfiniteListMethodOptions<
      { id: Id },
      Id,
      Item,
      'delete',
      Page,
      void
    >),
};
