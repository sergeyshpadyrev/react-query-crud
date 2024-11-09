import { createMockAPI, TestItem } from './api';
import { CrudInfiniteListMethods, useCrudInfiniteList } from '../../src';
import { useMemo } from 'react';

export const useItems = (testId: string, limit: number = 5) => {
    const api = useMemo(createMockAPI, []);

    const crud = useCrudInfiniteList<number, TestItem, { canFetchMore: boolean; items: TestItem[] }, number>({
        key: ['infinite-items', testId],
        list: (offset: number) => api.list(offset, limit),
        listHasMore: (pages) => (pages.length > 0 ? pages[pages.length - 1]?.canFetchMore ?? true : true),
        listPageParam: (pages) => pages.reduce((acc, page) => acc + page.items.length, 0),
    });

    return {
        ...crud,
        create: crud.method(CrudInfiniteListMethods.create(api.create)),
        delete: crud.method(CrudInfiniteListMethods.delete(api.delete)),
        one: crud.one(api.one),
        update: crud.method(CrudInfiniteListMethods.update(api.update)),
    };
};
