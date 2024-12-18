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

    const onDelete = useCrudInfiniteListUpdater<
        number,
        TestItem,
        { id: number },
        void,
        { canFetchMore: boolean; items: TestItem[] },
        number
    >({
        key,
        update: (data, _result, variables) => {
            const pageIndex = data.pages.findIndex((page) => page.items.some((item) => item.id === variables.id));
            return {
                pages: data.pages.map((page) => ({
                    ...page,
                    items: page.items.filter((item) => item.id !== variables.id),
                })),
                pageParams: data.pageParams.map((param, index) => (index > pageIndex ? param - 1 : param)),
            };
        },
    });

    const create = useNormalizedMutation<number, TestItem, { name: string }>({
        run: (variables) => api.create(variables),
        update: onCreate,
        typename,
    });
    const del = useNonNormalizedMutation({
        run: (variables) => api.delete(variables),
        update: onDelete,
    });
    const read = useCrudInfiniteListQuery<number, TestItem, { canFetchMore: boolean; items: TestItem[] }, number>({
        getNextPageParam: (lastPage, pages) => pages.flatMap((page) => page.items).length,
        initialPageParam: 0,
        key,
        fetch: (pageParam) => api.list(pageParam, limit),
        typename,
    });
    const update = useNormalizedMutation({
        run: (props: { id: number; name: string }) => api.update(props),
        typename,
    });

    return {
        create,
        delete: del,
        read,
        update,
    };
};
