import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export type CrudList<
  Item extends { id: Id },
  Id,
  ItemCreateData = Partial<Item>,
  ItemUpdateData = Partial<Item>
> = {
  create: (item: ItemCreateData) => Promise<Item>;
  createMutation: UseMutationResult<Item, Error, ItemCreateData, unknown>;
  delete: (id: Id) => Promise<void>;
  deleteMutation: UseMutationResult<void, Error, Id, unknown>;
  list: Item[];
  listQuery: UseQueryResult<Item[]>;
  update: (id: Id, data: ItemUpdateData) => Promise<Item>;
  updateMutation: UseMutationResult<
    Item,
    Error,
    { id: Id; item: ItemUpdateData },
    unknown
  >;
};

export interface CrudListOptions<
  Item extends { id: Id },
  Id,
  ItemCreateData = Partial<Item>,
  ItemUpdateData = Partial<Item>
> {
  crud: {
    create: (item: ItemCreateData) => Promise<Item>;
    delete: (id: Id) => Promise<void>;
    read: () => Promise<Item[]>;
    update: (id: Id, data: ItemUpdateData) => Promise<Item>;
  };
  key: any;
  settings: {
    order?: (items: Item[]) => Item[];
  };
}
