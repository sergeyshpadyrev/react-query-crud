import { createMockAPI, TestItem } from './api';
import { useCrudInfiniteList, useCrudInfiniteListQuery, useCrudInfiniteListUpdater, useCrudMutation } from '../../src';
import { useMemo } from 'react';

export const useItems = (testId: string, limit: number) => {
    const api = useMemo(createMockAPI, []);
    const key = ['infinite-items', testId];

    const onCreate = useCrudInfiniteListUpdater<
        number,
        TestItem,
        { name: string },
        TestItem,
        { canFetchMore: boolean; items: TestItem[] },
        number
    >({
        key,
        update: (data, result) => {
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

    const onUpdate = useCrudInfiniteListUpdater<
        number,
        TestItem,
        { id: number },
        TestItem,
        { canFetchMore: boolean; items: TestItem[] },
        number
    >({
        key,
        update: (data, result, variables) => ({
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items.map((item) => (item.id === result.id ? result : item)),
            })),
            pageParams: data.pageParams,
        }),
    });

    const create = useCrudMutation<{ name: string }, TestItem>({
        run: (variables) => api.create(variables),
        update: onCreate,
    });
    const del = useCrudMutation({
        run: (variables) => api.delete(variables),
        update: onDelete,
    });
    const read = useCrudInfiniteListQuery<number, TestItem, { canFetchMore: boolean; items: TestItem[] }, number>({
        getNextPageParam: (lastPage, pages) => pages.flatMap((page) => page.items).length,
        initialPageParam: 0,
        key,
        fetch: (pageParam) => api.list(pageParam, limit),
    });
    const update = useCrudMutation({
        run: (props: { id: number; name: string }) => api.update(props),
        update: onUpdate,
    });

    return {
        create,
        delete: del,
        read,
        update,
    };
};

export const useItemsInfiniteList = (testId: string, limit: number) => {
    const api = useMemo(createMockAPI, []);
    const key = ['infinite-items', testId];

    const list = useCrudInfiniteList<
        number,
        TestItem,
        { name: string },
        { name: string },
        { canFetchMore: boolean; items: TestItem[] },
        number
    >({
        key,

        defaultPageParam: 0,
        nextPageParam: (pages) => pages.flatMap((page) => page.items).length,

        create: api.create,
        delete: api.delete,
        read: (pageParam) => api.list(pageParam, limit),
        update: api.update,

        onCreate: (data, result) => ({
            pages: [{ canFetchMore: true, items: [result] }, ...data.pages],
            pageParams: [0, ...data.pageParams.map((param) => param + 1)],
        }),
        onDelete: (data, deletedItemId) => {
            const pageIndex = data.pages.findIndex((page) => page.items.some((item) => item.id === deletedItemId));
            return {
                pages: data.pages.map((page) => ({
                    ...page,
                    items: page.items.filter((item) => item.id !== deletedItemId),
                })),
                pageParams: data.pageParams.map((param, index) => (index > pageIndex ? param - 1 : param)),
            };
        },
        onUpdate: (data, result) => ({
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items.map((item) => (item.id === result.id ? result : item)),
            })),
            pageParams: data.pageParams,
        }),
    });

    return list;
};
