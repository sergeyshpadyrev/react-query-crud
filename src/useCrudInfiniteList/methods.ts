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
  update: <
    Id,
    Item extends { id: Id },
    ItemUpdateData,
    Page extends { items: Item[] }
  >(
    run: (variables: { id: Id; data: ItemUpdateData }) => Promise<Item>
  ) =>
    ({
      name: 'update',
      run,
      update: (pages: Page[], result: Item, { id }: { id: Id }) =>
        pages.map(page => ({
          ...page,
          items: page.items.map(item => (item.id === id ? result : item)),
        })),
    } as CrudInfiniteListMethodOptions<
      { id: Id; data: ItemUpdateData },
      Id,
      Item,
      'update',
      Page,
      Item
    >),
};
