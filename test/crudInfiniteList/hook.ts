import { createMockAPI, TestItem } from './api';
import {
    useCrudInfiniteListQuery,
    useCrudInfiniteListUpdater,
    useNonNormalizedMutation,
    useNormalizedMutation,
} from '../../src';
import { useMemo } from 'react';

export const useItems = (testId: string, limit: number) => {
    const api = useMemo(createMockAPI, []);

    const key = ['infinite-items', testId];
    const typename = 'item';

    const onCreate = useCrudInfiniteListUpdater<
        number,
        TestItem,
        { name: string },
        TestItem,
        { canFetchMore: boolean; items: TestItem[] },
        number
    >({
        key,
        update: (data, result, variables) => {
            return {
                pages: [{ canFetchMore: true, items: [result] }, ...data.pages],
                pageParams: [0, ...data.pageParams.map((param) => param + 1)],
            };
        },
    });

    const create = useNormalizedMutation<number, TestItem, { name: string }>({
        run: (variables) => api.create(variables),
        update: onCreate,
        typename,
    });

    const read = useCrudInfiniteListQuery<number, TestItem, { canFetchMore: boolean; items: TestItem[] }, number>({
        getNextPageParam: (lastPage, pages) => pages.flatMap((page) => page.items).length,
        initialPageParam: 0,
        key,
        fetch: (pageParam) => api.list(pageParam, limit),
        typename,
    });

    return {
        create,
        read,
    };
};
