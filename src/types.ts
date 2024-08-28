import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export type CrudList<
  Id,
  Item extends { id: Id },
  ItemCreateData,
  ItemUpdateData
> = {
  create: (item: ItemCreateData) => Promise<Item>;
  createMutation: UseMutationResult<Item, Error, ItemCreateData, unknown>;
  delete: (id: Id) => Promise<void>;
  deleteMutation: UseMutationResult<void, Error, Id, unknown>;
  list: Item[];
  listQuery: UseQueryResult<Item[]>;
  options: CrudListOptions<Id, Item, ItemCreateData, ItemUpdateData>;
  update: (id: Id, data: ItemUpdateData) => Promise<Item>;
  updateMutation: UseMutationResult<
    Item,
    Error,
    { id: Id; item: ItemUpdateData },
    unknown
  >;
};

export interface CrudListOptions<
  Id,
  Item extends { id: Id },
  ItemCreateData,
  ItemUpdateData
> {
  crud: {
    create: (item: ItemCreateData) => Promise<Item>;
    delete: (id: Id) => Promise<void>;
    read: () => Promise<Item[]>;
    update: (id: Id, data: ItemUpdateData) => Promise<Item>;
  };
  key: ReadonlyArray<any>;
  settings?: {
    order?: (items: Item[]) => Item[];
  };
}
