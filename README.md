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
import { useCrudList } from 'react-query-crud';

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
            ))}
            <button onClick={onClickCreate}>Create</button>
        </div>
    );
};
```

## Examples

### useCrudList

If you have API like this:

```ts
export interface ItemsAPI  {
    create: (item: { name: string }): Promise<Item>;
    delete: ({ id }: { id: number }): Promise<void>;
    list: (): Promise<Item[]>;
    update: ({ id, name }: { id: number; name: string }): Promise<Item>;
};
```

Then you can create a crud list:

```ts
import { useCrudList } from 'react-query-crud';

useCrudList<number, Item, { name: string }, { name: string }>({
    key: ['items'],

    create: (props: { name: string }) => api.create(props),
    delete: (props: { id: number }) => api.delete(props),
    read: () => api.list(),
    update: (props: { id: number; name: string }) => api.update(props),
});
```

### useCrudInfiniteList

If you have API like this:

```ts
export interface ItemsAPI {
    create: (item: { name: string }) => Promise<TestItem>;
    delete: ({ id }: { id: number }) => Promise<void>;
    list: (offset: number) => Promise<{ canFetchMore: boolean; items: TestItem[] }>;
    update: ({ id, name }: { id: number; name: string }) => Promise<TestItem>;
}
```

Then you can create a crud infinite list:

```ts
import { useCrudInfiniteList } from 'react-query-crud';

useCrudInfiniteList<number, Item, { name: string }, { name: string }, { canFetchMore: boolean; items: Item[] }, number>(
    {
        key: ['items'],

        defaultPageParam: 0,
        nextPageParam: (pages) => pages.flatMap((page) => page.items).length,

        create: (props: { name: string }) => api.create(props),
        delete: (props: { id: number }) => api.delete(props),
        read: (pageParam: number) => api.list(pageParam),
        update: (props: { id: number; name: string }) => api.update(props),

        onCreate: (data, result) => ({
            pages: [{ canFetchMore: true, items: [result] }, ...data.pages],
            pageParams: [0, ...data.pageParams.map((param) => param + 1)],
        }),
        onDelete: (data, deletedItemId) => {
            const pageIndex = data.pages.findIndex((page) => page.items.some((item) => item.id === deletedItemId));
            return {
                pages: data.pages.map((page) => ({
                    ...page,
                    items: page.items.filter((item) => item.id !== deletedItemId),
                })),
                pageParams: data.pageParams.map((param, index) => (index > pageIndex ? param - 1 : param)),
            };
        },
        onUpdate: (data, result) => ({
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items.map((item) => (item.id === result.id ? result : item)),
            })),
            pageParams: data.pageParams,
        }),
    },
);
```
