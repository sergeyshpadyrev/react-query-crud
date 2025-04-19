![workflow](https://github.com/sergeyshpadyrev/react-query-crud/actions/workflows/main.yml/badge.svg)
[![npm version](https://badge.fury.io/js/react-query-crud.svg)](https://badge.fury.io/js/react-query-crud)

# React query CRUD

This library is built on top of two libraries:

-   [react-query](https://github.com/TanStack/query)
-   [normy](https://github.com/klis87/normy)

It's used for creating CRUD lists

## Installation

```bash
# npm
npm install --save @tanstack/react-query react-query-crud
# yarn
yarn add @tanstack/react-query react-query-crud
```

## Getting started

First you should wrap your app with `QueryCrudClientProvider`

```ts
import { QueryClient } from '@tanstack/react-query';
import { QueryCrudClientProvider } from 'react-query-crud';

const queryClient = new QueryClient();

const App = () => <QueryCrudClientProvider client={queryClient}>{/* your app */}</QueryCrudClientProvider>;
```

Let's say you have an API like this:

```ts
import methods from './methods';

type Item = {
    id: string;
    name: string;
};


export default {
    create: (item: { name: string }): Promise<Item> = methods.post('/items', {name}),
    delete: ({ id }: { id: number }): Promise<void> => methods.delete(`items/${id}`),
    list: (): Promise<Item[]> => methods.get('/items'),
    update: ({ id, name }: { id: number; name: string }): Promise<Item> => methods.put(`items/${id}`, { name }),
};
```

Then you need to create a hook that will incapsulate all the logic for specific CRUD list:

```ts
import api from './api';
import {
    useCrudListQuery,
    useCrudListUpdater,
    useNonNormalizedMutation,
    useNormalizedMutation,
} from 'react-query-crud';

export const useItems = () => {
    const key = ['items'];
    const typename = 'item';

    const onCreate = useCrudListUpdater<number, Item, { name: string }, Item>({
        key,
        update: (items, result) => [...items, result],
    });
    const onDelete = useCrudListUpdater<number, Item, { id: number }, void>({
        key,
        update: (items, _result, props) => items.filter((item) => item.id !== props.id),
    });

    const create = useNormalizedMutation({
        run: (props: { name: string }) => api.create(props),
        update: onCreate,
        typename,
    });
    const del = useNonNormalizedMutation({
        run: (props: { id: number }) => api.delete(props),
        update: onDelete,
    });
    const read = useCrudListQuery<number, Item>({ key, fetch: () => api.list(), typename });
    const update = useNormalizedMutation({
        run: (props: { id: number; name: string }) => api.update(props),
        typename,
    });

    return {
        create,
        delete: del,
        read,
        update,
    };
};
```

Or simply you can use `useCrudList` hook instead:

```ts
const itemsAPI = useCrudList<number, Item, { name: string }, { name: string }>({
    create: (props: { name: string }) => api.create(props),
    delete: (props: { id: number }) => api.delete(props),
    key: ['items'],
    read: () => api.list(),
    typename: 'item',
    update: (props: { id: number; name: string }) => api.update(props),
});
```

Then you can use it in your component:

```tsx
import { useCallback } from 'react';
const Comp = () => {
    const itemsAPI = useItems();
    const items = itemsAPI.read();

    const onClickCreate = useCallback(() => itemsAPI.create({ name: 'New item' }), [items.create]);
    const onClickDelete = useCallback((id: string) => itemsAPI.delete({ id }), [items.delete]);
    const onClickUpdate = useCallback(
        (id: string, newName: string) => itemsAPI.update({ id, name: newName }),
        [items.update],
    );

    return (
        <div>
            {items.value.map((item) => (
                <div key={item.id}>
                    {item.name}
                    <button onClick={() => onClickUpdate(item.id, 'New name')}>Update</button>
                    <button onClick={() => onClickDelete(item.id)}>Delete</button>
                </div>
            ))}
            <button onClick={onClickCreate}>Create</button>
        </div>
    );
};
```

## Documentation

### Query

You have three types of CRUD entities:

-   `useCrudQuery`
-   `useCrudInfiniteListQuery`
-   `useCrudListQuery`

Each of them return an object with fields:

-   `query` - react-query object
-   `value` - flattened value

### Query updater

For each type you have a corresponding updater that can be passed to mutations:

-   `useCrudUpdater`
-   `useCrudListUpdater`
-   `useCrudInfiniteListUpdater`

### Mutation

There are also two types of mutations:

-   `useNormalizedMutation`
-   `useNonNormalizedMutation`

Normalized mutation should always return the type of the entity, while non-normalized mutation can return anything.
The entity returned by normalized mutation will be used to update the normalization object (in react-query cache).

If you want to use normalization in objects inside nested arrays just add `__typename` field to each object.
