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

#### useCrudList

Options:

-   Name: `key`
    Type: `string`
    Required
    Description: query key for `react-query`

-   Name: `list`
    Type: `() => Promise<Item[]>`
    Required
    Description: function to fetch items

-   Name: `listOrder`
    Type: `(item: Item) => Promise<Item[]>`
    Optional
    Description: function to sort items

Returned object:

-   Name: `list`
    Type: `Item[]`
    Required
    Description: list of items

-   Name: `listQuery`
    Type: `UseQueryResult<Item[]>`
    Required
    Description: `react-query` query

-   Name: `options`
    Type: `CrudListOptions<Id, Item extends { id: Id }>`
    Required
    Description: original options
