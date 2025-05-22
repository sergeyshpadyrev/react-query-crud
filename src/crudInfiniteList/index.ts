import { useMemo } from 'react';
import { CrudInfiniteListProps, CrudInfiniteListQueryProps, CrudInfiniteListUpdaterProps } from './types';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCrudMutation } from '../crudMutation';

export const useCrudInfiniteListQuery =
    <Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam>(
        props: CrudInfiniteListQueryProps<Id, Item, Page, PageParam>,
    ) =>
    () => {
        const query = useInfiniteQuery({
            getNextPageParam: (lastPage: Page | undefined, pages: Page[]) => props.getNextPageParam(lastPage, pages),
            initialPageParam: props.initialPageParam,
            queryKey: props.key,
            queryFn: async ({ pageParam }) => props.fetch(pageParam as PageParam),
        });
        const value = useMemo(() => query.data?.pages?.flatMap((page) => page.items) ?? [], [query.data]);

        return { query, value };
    };

export const useCrudInfiniteListUpdater = <
    Id,
    Item extends { id: Id },
    Argument,
    Result,
    Page extends { items: Item[] },
    PageParam,
>(
    props: CrudInfiniteListUpdaterProps<Id, Item, Argument, Result, Page, PageParam>,
) => {
    const queryClient = useQueryClient();
    return (result: Result, variables: Argument) => {
        const data = queryClient.getQueryData<{ pages: Page[]; pageParams: PageParam[] }>(props.key);
        if (!data) return;

        const updatedData = props.update(data, result, variables);
        queryClient.setQueryData(props.key, updatedData);
    };
};

export const useCrudInfiniteList = <
    Id,
    Item extends { id: Id },
    CreateProps,
    UpdateProps,
    Page extends { items: Item[] },
    PageParam,
>(
    props: CrudInfiniteListProps<Id, Item, CreateProps, UpdateProps, Page, PageParam>,
) => {
    const onCreate = useCrudInfiniteListUpdater<Id, Item, CreateProps, Item, Page, PageParam>({
        key: props.key,
        update: (data, result) => props.onCreate(data, result),
    });

    const onDelete = useCrudInfiniteListUpdater<Id, Item, { id: Id }, void, Page, PageParam>({
        key: props.key,
        update: (data, _result, variables) => props.onDelete(data, variables.id),
    });

    const onUpdate = useCrudInfiniteListUpdater<Id, Item, UpdateProps, Item, Page, PageParam>({
        key: props.key,
        update: (data, result, variables) => props.onUpdate(data, result),
    });

    const create = useCrudMutation({
        run: props.create,
        update: onCreate,
    });
    const del = useCrudMutation({
        run: props.delete,
        update: onDelete,
    });
    const read = useCrudInfiniteListQuery<Id, Item, Page, PageParam>({
        getNextPageParam: (lastPage, pages) => props.nextPageParam(pages),
        initialPageParam: props.defaultPageParam,
        key: props.key,
        fetch: props.read,
    });
    const update = useCrudMutation({
        run: props.update,
        update: onUpdate,
    });

    return {
        create,
        delete: del,
        read,
        update,
    };
};
