import { CrudListMethodOptions } from './types';

export const CrudListMethods = {
  create: <Id, Item extends { id: Id }, ItemCreateData>(
    run: (variables: ItemCreateData) => Promise<Item>
  ) =>
    ({
      name: 'create',
      run,
      update: (items: Item[], result: Item) => [...items, result],
    } as CrudListMethodOptions<ItemCreateData, Id, Item, 'create', Item>),
  delete: <Id, Item extends { id: Id }>(
    run: (variables: { id: Id }) => Promise<void>
  ) =>
    ({
      name: 'delete',
      run,
      update: (items: Item[], _result: void, variables: { id: Id }) =>
        items.filter(item => item.id !== variables.id),
    } as CrudListMethodOptions<{ id: Id }, Id, Item, 'delete', void>),
  update: <Id, Item extends { id: Id }, ItemUpdateData = Partial<Item>>(
    run: (variables: { id: Id; data: ItemUpdateData }) => Promise<Item>
  ) =>
    ({
      name: 'update',
      run,
      update: (items: Item[], result: Item) =>
        items.map(item => (item.id === result.id ? result : item)),
    } as CrudListMethodOptions<
      { id: Id; data: ItemUpdateData },
      Id,
      Item,
      'update',
      Item
    >),
};
