export type TestItem = { id: number; name: string };

export const defaultItems: TestItem[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
    { id: 5, name: 'Eve' },
    { id: 6, name: 'Frank' },
    { id: 7, name: 'Grace' },
    { id: 8, name: 'Hank' },
    { id: 9, name: 'Ivy' },
    { id: 10, name: 'Jack' },
];

export const createMockAPI = () => {
    let items: TestItem[] = [...defaultItems];
    return {
        create: (item: { name: string }): Promise<{ canFetchMore: boolean; items: TestItem[] }> =>
            new Promise(resolve => {
                const newItem = { id: items.length + 1, name: item.name };
                items.unshift(newItem);
                resolve({ canFetchMore: true, items: [newItem] });
            }),
        delete: ({ id }: { id: number }): Promise<void> =>
            new Promise(resolve => {
                items = items.filter(item => item.id !== id);
                resolve();
            }),
        list: (
            offset: number,
            limit: number,
        ): Promise<{
            canFetchMore: boolean;
            items: TestItem[];
        }> =>
            Promise.resolve({
                canFetchMore: items.length > offset + limit,
                items: items.slice(offset, offset + limit),
            }),
        update: ({ id, data }: { id: number; data: { name: string } }): Promise<TestItem> =>
            new Promise(resolve => {
                items = items.map(item => (item.id === id ? { ...item, ...data } : item));
                resolve(items.find(item => item.id === id)!);
            }),
    };
};
