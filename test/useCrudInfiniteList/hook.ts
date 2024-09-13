import { createMockAPI, TestItem } from './api.mock';
import { CrudInfiniteListMethods, useCrud, useCrudInfiniteList } from '../../src';
import { useMemo } from 'react';

export const useItem = (
    key: ReadonlyArray<any>,
    id: number,
    api: { one: (id: number) => Promise<TestItem | null> },
) => {
    const crud = useCrud({ data: () => api.one(id), key });
    return crud;
};

export const useItems = (testId: string, limit: number = 5) => {
    const api = useMemo(createMockAPI, []);

    const crud = useCrudInfiniteList({
        key: ['infinite-items', testId],
        list: (offset: number) => api.list(offset, limit),
        listHasMore: (pages) => (pages.length > 0 ? pages[pages.length - 1]?.canFetchMore ?? true : true),
        listPageParam: (pages) => pages.reduce((acc, page) => acc + page.items.length, 0),
    });

    return {
        ...crud,
        api,
        create: crud.method(CrudInfiniteListMethods.create(api.create)),
        delete: crud.method(CrudInfiniteListMethods.delete(api.delete)),
        update: crud.method(CrudInfiniteListMethods.update(api.update)),
    };
};
