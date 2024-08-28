export type TestItem = { id: number; name: string };

export const defaultItems: TestItem[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

export const createMockAPI = () => {
  let items: TestItem[] = [...defaultItems];
  return {
    create: (item: { name: string }): Promise<TestItem> =>
      new Promise(resolve => {
        const newItem = { id: items.length + 1, name: item.name };
        items.push(newItem);
        resolve(newItem);
      }),
    delete: (id: number): Promise<void> =>
      new Promise(resolve => {
        items = items.filter(item => item.id !== id);
        resolve();
      }),
    read: (): Promise<TestItem[]> => Promise.resolve(items),
    recreate: (id: number): Promise<TestItem> =>
      new Promise(resolve => {
        const item = items.find(item => item.id === id);
        const newItem = { ...item, id: items.length + 1 } as TestItem;
        items = [...items.filter(item => item.id !== id), newItem];
        resolve(newItem);
      }),
    update: (id: number, updating: { name: string }): Promise<TestItem> =>
      new Promise(resolve => {
        items = items.map(item =>
          item.id === id ? { ...item, ...updating } : item
        );
        resolve(items.find(item => item.id === id)!);
      }),
  };
};