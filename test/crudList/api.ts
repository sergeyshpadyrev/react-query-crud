export type TestItem = { id: number; name: string };

export const defaultItems: TestItem[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
];

export const createMockAPI = () => {
    let items: TestItem[] = [...defaultItems];
    return {
        create: (item: { name: string }): Promise<TestItem> =>
            new Promise((resolve) => {
                const newItem = { id: items.length + 1, name: item.name };
                items.push(newItem);
                resolve(newItem);
            }),
        delete: ({ id }: { id: number }): Promise<void> =>
            new Promise((resolve) => {
                items = items.filter((item) => item.id !== id);
                resolve();
            }),
        list: (): Promise<TestItem[]> => Promise.resolve([...items]),
        update: ({ id, name }: { id: number; name: string }): Promise<TestItem> =>
            new Promise((resolve) => {
                items = items.map((item) => (item.id === id ? { ...item, name } : item));
                resolve(items.find((item) => item.id === id)!);
            }),
    };
};
