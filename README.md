# React query CRUD

This library is built on top of `@tanstack/react-query`.

It creates a list of items fetched from API and automatically manages query cache updates for CRUD operations:

-   When you use `create` it adds item to the list
-   When you use `delete` it removes item from the list
-   When you use `update` it changes item in the list

## Installation

```bash
# npm
npm install --save react-query-crud
# yarn
yarn add react-query-crud
```

## Getting started

```ts
import api from './api';
import { CrudListMethods, useCrudList } from 'react-query-crud';

type Item = {
    id: string;
    name: string;
};

const items = useCrudList({
    key: ['items'],
    list: () => api.items.fetch(), // This API method should return Item[]
})
    .addMethod(CrudListMethods.create(data => api.items.create(data))) // This API method should return Item
    .addMethod(CrudListMethods.delete(({ id }) => api.delete(id))) // This API method should return void
    .addMethod(CrudListMethods.update(({ id, data }) => api.update(id, data))); // This API method should return Item

const onClickCreate = () => items.create({ name: 'New item' });
const onClickDelete = (id: string) => items.delete({ id });
const onClickUpdate = (id: string, newName: string) => items.update({ id, data: { name: newName } });

return (
    <div>
        {items.list.map(item => (
            <div key={item.id}>{item.name}</div>
        ))}
    </div>
);
```

## API documentation

### useCrudList

#### Generic types:

-   `Id`
-   `Item extends { id: Id }`

#### Options:

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

#### Returned object:

-   Name: `list` <br/>
    Type: `Item[]` <br/>
    Description: list of items <br/>

-   Name: `listLoading` <br/>
    Type: `boolean` <br/>
    Description: list loading flag <br/>

-   Name: `listQuery` <br/>
    Type: `UseQueryResult<Item[]>` <br/>
    Description: `react-query` query <br/>

-   Name: `options` <br/>
    Type: `CrudListOptions<Id, Item extends { id: Id }>` <br/>
    Description: original options <br/>

-   Name: `addMethod` <br/>
    Type: `{ name: string; run: (variables: Argument) => Promise<Result>; update: (items: Item[], result: Result, variables: Argument) => Item[]; }` <br/>
    Description: function to add method <br/>

#### Example:

```ts
import { CrudListMethods, useCrudList } from 'react-query-crud';

useCrudList({
    key: ['items'],
    list: () => api.fetchItems(),
})
    .addMethod(CrudListMethods.create((data: { name: string }) => api.createItem(data)))
    .addMethod(CrudListMethods.delete(({ id }: { id: string }) => api.deleteItem(id)))
    .addMethod(CrudListMethods.update(({ id: data }: { id: string; data: { name: string } }) => api.update(id, data)))
    .addMethod({
        name: 'recreate',
        run: (id: number) => api.recreate(id),
        update: (items, result, oldId) => [...items.filter(item => item.id !== oldId), result],
    });
```

### useCrudInfiniteList

#### Generic types:

-   `Id`
-   `Item extends { id: Id }`
-   `Page extends { items: Item[] }`
-   `PageParam`

#### Options:

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

#### Returned object:

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

-   Name: `options` <br/>
    Type: `CrudListInfiniteOptions<Id, Item extends { id: Id }, Page, Param>` <br/>
    Description: original options <br/>

-   Name: `addMethod` <br/>
    Type: `{ name: string; run: (variables: Argument) => Promise<Result>; update: (pages: Page[], result: Result, variables: Argument) => Page[]; }` <br/>
    Description: function to add method <br/>

#### Example:

```ts
import { CrudInfiniteListMethods, useCrudInfiniteList } from 'react-query-crud';

useCrudInfiniteList({
    key: ['infinite-items'],
    list: (offset: number) => api.list(offset, limit),
    listHasMore: pages => (pages.length > 0 ? pages[pages.length - 1].canFetchMore : true),
    listPageParam: pages => pages.reduce((acc, page) => acc + page.items.length, 0),
})
    .addMethod(CrudInfiniteListMethods.create(api.create))
    .addMethod(CrudInfiniteListMethods.delete(api.delete))
    .addMethod(CrudInfiniteListMethods.update(api.update))
    .addMethod(
      name: 'recreate',
      run: (id: number) => api.recreate(id),
      update: (pages: Page[], result: Item, id: number) =>
        pages.map(page => ({
          ...page,
          items: page.items.map(item => (item.id === id ? result : item)),
        })),);
```
