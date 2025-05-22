![workflow](https://github.com/sergeyshpadyrev/react-query-crud/actions/workflows/main.yml/badge.svg)
[![npm version](https://badge.fury.io/js/react-query-crud.svg)](https://badge.fury.io/js/react-query-crud)

# React query CRUD

This library is built on top of `@tanstack/query` and it's used for creating CRUD lists

## Installation

```bash
# npm
npm install --save @tanstack/react-query react-query-crud
# yarn
yarn add @tanstack/react-query react-query-crud
```

## Getting started

First you should wrap your app with `QueryClientProvider`

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => <QueryClientProvider client={queryClient}>{/* your app */}</QueryClientProvider>;
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

You can create a crud list from it:

```ts
const itemsAPI = useCrudList<number, Item, { name: string }, { name: string }>({
    create: (props: { name: string }) => api.create(props),
    delete: (props: { id: number }) => api.delete(props),
    key: ['items'],
    read: () => api.list(),
    update: (props: { id: number; name: string }) => api.update(props),
});
```

Then you can use it in your component:

```tsx
import { useCallback } from 'react';

const Component = () => {
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
            )}
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

There is only one type of mutation:

-   `useCrudMutation`
