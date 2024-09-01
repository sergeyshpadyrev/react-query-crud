import {
    CrudInfiniteList,
    CrudInfiniteListMethod,
    CrudInfiniteListMethodOptions,
    CrudInfiniteListOptions,
} from './types';
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

const createMethod = <Argument, Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam, Result>(
    options: CrudInfiniteListOptions<Id, Item, Page, PageParam>,
    method: CrudInfiniteListMethodOptions<Argument, Id, Item, Page, Result>,
) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: method.run,
        onSuccess: (data, variables) =>
            queryClient.setQueryData(
                options.key,
                ({ pages }: { pageParams: PageParam[]; pages: Page[] | undefined }) => {
                    const newPages = method.update(pages ?? [], data, variables);
                    return {
                        pageParams: newPages.reduce(
                            acc => ({
                                params: [options.listPageParam(acc.restPages), ...acc.params],
                                restPages: acc.restPages.slice(0, acc.restPages.length - 1),
                            }),
                            { params: [], restPages: [] } as {
                                params: PageParam[];
                                restPages: Page[];
                            },
                        ).params,
                        pages: newPages,
                    };
                },
            ),
    });
    const mutationFunction = useMemo(() => {
        const func = (argument: Argument) => mutation.mutateAsync(argument);
        func.mutation = mutation;
        return func;
    }, [mutation]);
    return mutationFunction as CrudInfiniteListMethod<Argument, Result>;
};

export const useCrudInfiniteList = <Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam>(
    options: CrudInfiniteListOptions<Id, Item, Page, PageParam>,
): CrudInfiniteList<Id, Item, Page, PageParam> => {
    const listQuery = useInfiniteQuery<Page, Error, InfiniteData<Page, PageParam>>({
        getNextPageParam: (_lastPage: Page, pages: Page[] | undefined) => options.listPageParam(pages ?? []),
        initialPageParam: options.listPageParam([]),
        queryKey: options.key,
        queryFn: ({ pageParam }) => options.list(pageParam as PageParam),
    });
    const list = useMemo(() => {
        if (!listQuery.data) return [];

        const items = listQuery.data.pages.flatMap(page => page.items);
        return !!options.listOrder ? options.listOrder(items) : items;
    }, [listQuery.data]);
    const listHasMore = useMemo(() => {
        if (!listQuery.data) return true;
        return options.listHasMore(listQuery.data.pages);
    }, [listQuery.data]);
    const method = <Argument, Result>(methodOptions: CrudInfiniteListMethodOptions<Argument, Id, Item, Page, Result>) =>
        createMethod(options, methodOptions);

    return {
        list,
        listFetchMore: listQuery.fetchNextPage,
        listHasMore,
        listLoading: listQuery.isLoading,
        listQuery,
        method,
        options,
    };
};

export * from './methods';
