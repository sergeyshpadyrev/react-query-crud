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

    const read = useCrudInfiniteListQuery<number, TestItem, { canFetchMore: boolean; items: TestItem[] }, number>({
        getNextPageParam: (lastPage, pages) => pages.flatMap((page) => page.items).length,
        initialPageParam: 0,
        key,
        fetch: (pageParam) => api.list(pageParam, limit),
        typename,
    });

    return {
        read,
    };
};
