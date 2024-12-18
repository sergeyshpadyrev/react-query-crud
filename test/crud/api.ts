export type TestItem = { id: number; name: string };

export const defaultItem: TestItem = { id: 1, name: 'Alice' };

export const createMockAPI = () => {
    let item: TestItem | null = defaultItem;
    return {
        create: (item: { name: string }): Promise<TestItem> =>
            new Promise((resolve) => {
                const newItem = { id: 2, name: item.name };
                item = newItem;
                resolve(newItem);
            }),
        delete: (): Promise<void> =>
            new Promise((resolve) => {
                item = null;
                resolve();
            }),
        get: (): Promise<TestItem | null> => Promise.resolve(item),
        update: (data: { name: string }): Promise<TestItem> =>
            new Promise((resolve) => {
                item = { ...item!, name: data.name };
                resolve(item);
            }),
    };
};
