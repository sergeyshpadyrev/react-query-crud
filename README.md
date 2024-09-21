# React query CRUD

This library is built on top of `@tanstack/react-query`.

It creates a list of items fetched from API and automatically manages query cache updates for CRUD operations:

-   When you use `create` it adds item to the list
-   When you use `delete` it removes item from the list
-   When you use `update` it changes item in the list

## Installation

```bash
# npm
npm install --save @tanstack/react-query react-query-crud
# yarn
yarn add @tanstack/react-query react-query-crud
```

## Getting started

```ts
import api from './api';
import { CrudListMethods, useCrudList } from 'react-query-crud';
import React from 'react';

type Item = {
    id: string;
    name: string;
};

const useItemsCrud = () => {
    const crud = useCrudList({
        key: ['items'],
        list: () => api.items.fetch(), // This API method should return Item[]
    });

    return {
        ...crud,
        create: crud.method(CrudListMethods.create((data) => api.items.create(data))), // This API method should return Item
        delete: crud.method(CrudListMethods.delete(({ id }) => api.delete(id))), // This API method should return void
        update: crud.method(CrudListMethods.update(({ id, data }) => api.update(id, data))), // This API method should
    };
};

const Comp = () => {
    const items = useItemsCrud();

    const onClickCreate = () => items.create({ name: 'New item' });
    const onClickDelete = (id: string) => items.delete({ id });
    const onClickUpdate = (id: string, newName: string) => items.update({ id, data: { name: newName } });

    return (
        <div>
            {items.list.map((item) => (
                <div key={item.id}>{item.name}</div>
            ))}
        </div>
    );
};
```

## API documentation

### Hooks

#### useCrud

##### Generic types:

-   `Item`

##### Options:

-   Name: `key` <br/>
    Type: `string` <br/>
    Required <br/>
    Description: query key for `react-query` <br/>

-   Name: `data` <br/>
    Type: `() => Promise<Item | null>` <br/>
    Required <br/>
    Description: function to fetch item <br/>

##### Returned object:

-   Name: `data` <br/>
    Type: `Item | null` <br/>
    Description: list of items <br/>

-   Name: `dataLoading` <br/>
    Type: `boolean` <br/>
    Description: list loading flag <br/>

-   Name: `dataQuery` <br/>
    Type: `UseQueryResult<Item | null>` <br/>
    Description: `react-query` query <br/>

-   Name: `method` <br/>
    Type: `{ run: (variables: Argument) => Promise<Result>; update: (item: Item | null, result: Result, variables: Argument) => Item | null; }` <br/>
    Description: function to create method <br/>

-   Name: `options` <br/>
    Type: `CrudOptions<Item>` <br/>
    Description: original options <br/>

##### Example:

```ts
import { CrudMethods, useCrud } from 'react-query-crud';

const useItems = () => {
    const crud = useCrud({
        key: ['item'],
        data: () => api.fetchItem(),
    });
    return {
        ...crud,
        create: crud.method(CrudMethods.create((data: { name: string }) => api.createItem(data))),
        delete: crud.method(CrudMethods.delete({ id }: { id: string }) => api.deleteItem(id))),
        update: crud.method(CrudMethods.update((data: { name: string }) => api.updateItem(data))),
    };
};
```

#### useCrudList

##### Generic types:

-   `Id`
-   `Item extends { id: Id }`

##### Options:

-   Name: `key` <br/>
    Type: `string` <br/>
    Required <br/>
    Description: query key for `react-query` <br/>

-   Name: `list` <br/>
    Type: `() => Promise<Item[]>` <br/>
    Required <br/>
    Description: function to fetch items <br/>

-   Name: `listOrder` <br/>
    Type: `(item: Item) => Promise<Item[]>` <br/>
    Optional <br/>
    Description: function to sort items <br/>

##### Returned object:

-   Name: `list` <br/>
    Type: `Item[]` <br/>
    Description: list of items <br/>

-   Name: `listLoading` <br/>
    Type: `boolean` <br/>
    Description: list loading flag <br/>

-   Name: `listQuery` <br/>
    Type: `UseQueryResult<Item[]>` <br/>
    Description: `react-query` query <br/>

-   Name: `method` <br/>
    Type: `{ run: (variables: Argument) => Promise<Result>; update: (items: Item[], result: Result, variables: Argument) => Item[]; }` <br/>
    Description: function to create method <br/>

-   Name: `options` <br/>
    Type: `CrudListOptions<Id, Item extends { id: Id }>` <br/>
    Description: original options <br/>

##### Example:

```ts
import { CrudListMethods, useCrudList } from 'react-query-crud';

const useItems = () => {
    const crud = useCrudList({
        key: ['items'],
        list: () => api.fetchItems(),
    });
    return {
        ...crud,
        create: crud.method(CrudListMethods.create((data: { name: string }) => api.createItem(data))),
        delete: crud.method(CrudListMethods.delete(({ id }: { id: string }) => api.deleteItem(id))),
        recreate: crud.method({
            run: (id: number) => api.recreate(id),
            update: (items, result, oldId) => [...items.filter((item) => item.id !== oldId), result],
        }),
        update: crud.method(
            CrudListMethods.update(({ id: data }: { id: string; data: { name: string } }) => api.updateItem(id, data)),
        ),
    };
};
```

#### useCrudInfiniteList

##### Generic types:

-   `Id`
-   `Item extends { id: Id }`
-   `Page extends { items: Item[] }`
-   `PageParam`

##### Options:

-   Name: `key` <br/>
    Type: `string` <br/>
    Required <br/>
    Description: query key for `react-query` <br/>

-   Name: `list` <br/>
    Type: `(pageParam: PageParam) => Promise<Page>` <br/>
    Required <br/>
    Description: function to fetch items <br/>

-   Name: `listHasMore` <br/>
    Type: `(pages: Page[]) => boolean` <br/>
    Required <br/>
    Description: function to check if list has more items <br/>

-   Name: `listPageParam` <br/>
    Type: `(pages: Page[]) => PageParam` <br/>
    Required <br/>
    Description: function to get page param for next page <br/>

-   Name: `listOrder` <br/>
    Type: `(item: Item) => Promise<Item[]>` <br/>
    Optional <br/>
    Description: function to sort items <br/>

##### Returned object:

-   Name: `list` <br/>
    Type: `Item[]` <br/>
    Description: list of items <br/>

-   Name: `listFetchMore` <br/>
    Type: `() => void` <br/>
    Description: function to fetch more elements <br/>

-   Name: `listHasMore` <br/>
    Type: `boolean` <br/>
    Description: flag that shows if list has more elements <br/>

-   Name: `listLoading` <br/>
    Type: `boolean` <br/>
    Description: list loading flag <br/>

-   Name: `listQuery` <br/>
    Type: `UseInfinteQueryResult<InfiniteData<Page, PageParam>>` <br/>
    Description: `react-query` infinite query <br/>

-   Name: `method` <br/>
    Type: `{ run: (variables: Argument) => Promise<Result>; update: (pages: Page[], result: Result, variables: Argument) => Page[]; updateOne?: (item: Item | null, result: Result, variables: Argument) => Item | null }` <br/>
    Description: function to create method that can update list and single item of infinite list<br/>

-   Name: `one` <br/>
    Type: `(run: (id: Id) => Promise<Item>) => Crud<Item>` <br/>
    Description: function to create crud for single item of infinite list that will be updated by crud methods as well<br/>

-   Name: `options` <br/>
    Type: `CrudListInfiniteOptions<Id, Item extends { id: Id }, Page, Param>` <br/>
    Description: original options <br/>

##### Example:

```ts
import { CrudInfiniteListMethods, useCrudInfiniteList } from 'react-query-crud';

const useItems = () => {
    const crud = useCrudInfiniteList({
        key: ['infiniteItems'],
        list: (offset: number) => api.list(offset, limit),
        listHasMore: (pages) => (pages.length > 0 ? pages[pages.length - 1].canFetchMore : true),
        listPageParam: (pages) => pages.reduce((acc, page) => acc + page.items.length, 0),
    });
    return {
        ...crud,
        create: crud.method(CrudInfiniteListMethods.create(api.create)),
        delete: crud.method(CrudInfiniteListMethods.delete(api.delete)),
        one: crud.one(api.getOne),
        recreate: crud.method({
            run: (id: number) => api.recreate(id),
            update: (pages: Page[], result: Item, id: number) =>
                pages.map((page) => ({
                    ...page,
                    items: page.items.map((item) => (item.id === id ? result : item)),
                })),
        }),
        update: crud.method(CrudInfiniteListMethods.update(api.update)),
    };
};
```

### Methods

#### Crud methods templates

The library contains a few common crud methods templates:

##### CrudMethod

-   `CrudMethods.create`
-   `CrudMethods.delete`
-   `CrudMethods.update`

##### CrudListMethod

-   `CrudListMethods.create`
-   `CrudListMethods.delete`
-   `CrudListMethods.update`

##### CrudInfiniteListMethod

-   `CrudInfiniteListMethods.create`
-   `CrudInfiniteListMethods.delete`
-   `CrudInfiniteListMethods.update`

#### Mutation

Every method has `mutation` field that is a mutation from `react-query`

##### Example:

```js
import { CrudListMethods, useCrudList } from 'react-query-crud';

const useItems = () => {
    const crud = useCrudList({
        key: ['items'],
        list: () => api.fetchItems(),
    });
    return {
        ...crud,
        create: crud.method(CrudListMethods.create((data: { name: string }) => api.createItem(data))),
    };
};

const itemsCrudList = useItems();
const createItem = () => itemsCrudList.create({ name: 'New item' });
const createItemProcessing = itemsCrudList.create.mutation.isPending;
```
