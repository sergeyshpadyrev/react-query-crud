import { CrudListMethodOptions } from './types';

export const CrudListMethods = {
    create: <Id, Item extends { id: Id }, ItemCreateData>(run: (variables: ItemCreateData) => Promise<Item>) =>
        ({
            run,
            update: (items: Item[], result: Item) => [...items, result],
        } as CrudListMethodOptions<ItemCreateData, Id, Item, Item>),
    delete: <Id, Item extends { id: Id }>(run: (variables: { id: Id }) => Promise<void>) =>
        ({
            run,
            update: (items: Item[], _result: void, variables: { id: Id }) =>
                items.filter(item => item.id !== variables.id),
        } as CrudListMethodOptions<{ id: Id }, Id, Item, void>),
    update: <Id, Item extends { id: Id }, ItemUpdateData = Partial<Item>>(
        run: (variables: { id: Id; data: ItemUpdateData }) => Promise<Item>,
    ) =>
        ({
            run,
            update: (items: Item[], result: Item) => items.map(item => (item.id === result.id ? result : item)),
        } as CrudListMethodOptions<{ id: Id; data: ItemUpdateData }, Id, Item, Item>),
};
