# React query CRUD

This library is built on top of `@tanstack/react-query`.

It creates a list of items fetched from API and automatically manages query cache updates for CRUD operations:

- When you use `create` it adds item to the list
- When you use `delete` it removes item from the list
- When you use `update` it changes item in the list

## Installation

```sh
# npm
npm install --save react-query-crud
# yarn
yarn add react-query-crud
```

## Getting started

```js
import api from './api';
import { useCrudList } from 'react-query-crud';

type Item = {
    id: string
    name: string
}

const items = useCrudList<Item>({
  crud: {
    create: data => api.items.create(data), // This method should return Item
    delete: id => api.items.delete(id),
    read: () => api.items.fetch(), // This method should return Item[]
    update: (id, data) => api.items.update(id, data), // This method should return Item
  },
  key: 'items'
});

const onClickCreate = () => items.create({ name: 'New item' });
const onClickDelete = (id: string) => items.delete(id);
const onClickUpdate = (id: string, newName: string) => items.update(id, {name: newName});

return (
  <div>
    {items.list.map(item => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>
);
```
