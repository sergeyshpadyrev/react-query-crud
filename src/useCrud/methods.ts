import { CrudMethodOptions } from './types';

export const CrudMethods = {
    create: <Item, ItemCreateData = Partial<Item>>(run: (variables: ItemCreateData) => Promise<Item>) =>
        ({
            run,
            update: (_item: Item | null, result: Item) => result,
        } as CrudMethodOptions<ItemCreateData, Item, Item>),
    delete: <Item>(run: () => Promise<void>) =>
        ({
            run,
            update: () => null,
        } as CrudMethodOptions<unknown, Item, void>),
    update: <Item, ItemUpdateData = Partial<Item>>(run: (variables: ItemUpdateData) => Promise<Item>) =>
        ({
            run,
            update: (_item: Item | null, result: Item) => result,
        } as CrudMethodOptions<ItemUpdateData, Item, Item>),
};
