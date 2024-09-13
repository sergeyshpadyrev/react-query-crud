import { useCrud } from '../useCrud';
import { arrayStartsWith } from '../utils';
import {
    CrudInfiniteList,
    CrudInfiniteListMethod,
    CrudInfiniteListMethodOptions,
    CrudInfiniteListOptions,
} from './types';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

const oneCrudKeyPrefix = (key: ReadonlyArray<any>) => [...key, 'one'];

const createMethod = <Argument, Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam, Result>(
    options: CrudInfiniteListOptions<Id, Item, Page, PageParam>,
    method: CrudInfiniteListMethodOptions<Argument, Id, Item, Page, Result>,
) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: method.run,
        onSuccess: (data: Result, variables: Argument) => {
            if (!!method.updateOne) {
                const queries = queryClient.getQueryCache().getAll();
                const oneQueries = queries.filter((query) =>
                    arrayStartsWith(query.queryKey, oneCrudKeyPrefix(options.key)),
                );
                oneQueries.forEach((oneQuery) => {
                    queryClient.setQueryData(oneQuery.queryKey, (item: Item | null) =>
                        method.updateOne!(item, data, variables),
                    );
                });
            }

            queryClient.setQueryData(
                options.key,
                ({ pages }: { pageParams: PageParam[]; pages: Page[] | undefined }) => {
                    const newPages = method.update(pages ?? [], data, variables);
                    return {
                        pageParams: newPages.reduce(
                            (acc) => ({
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
            );
        },
    });
    const mutationFunction = useMemo(() => {
        const func = (argument: Argument) => mutation.mutateAsync(argument);
        func.mutation = mutation;
        return func;
    }, [mutation]);
    return mutationFunction as CrudInfiniteListMethod<Argument, Result>;
};

const createOne =
    <Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam>(
        options: CrudInfiniteListOptions<Id, Item, Page, PageParam>,
        fetch: (id: Id) => Promise<Item | null>,
    ) =>
    (id: Id) => {
        const crud = useCrud({
            data: () => fetch(id),
            key: [...oneCrudKeyPrefix(options.key), id],
        });
        return crud;
    };

export const useCrudInfiniteList = <Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam>(
    options: CrudInfiniteListOptions<Id, Item, Page, PageParam>,
): CrudInfiniteList<Id, Item, Page, PageParam> => {
    const listQuery = useInfiniteQuery<Page, Error, InfiniteData<Page, PageParam>>({
        getNextPageParam: (_lastPage: Page, pages: Page[] | undefined) => options.listPageParam(pages ?? []),
        initialPageParam: options.listPageParam([]),
        queryKey: options.key,
        queryFn: ({ pageParam }: any) => options.list(pageParam as PageParam),
    });
    const list = useMemo(() => {
        if (!listQuery.data) return [];

        const items = listQuery.data.pages.flatMap((page: Page) => page.items);
        return !!options.listOrder ? options.listOrder(items) : items;
    }, [listQuery.data]);
    const listHasMore = useMemo(() => {
        if (!listQuery.data) return true;
        return options.listHasMore(listQuery.data.pages);
    }, [listQuery.data]);
    const method = <Argument, Result>(methodOptions: CrudInfiniteListMethodOptions<Argument, Id, Item, Page, Result>) =>
        createMethod(options, methodOptions);
    const one = (fetch: (id: Id) => Promise<Item | null>) => createOne(options, fetch);

    return {
        list,
        listFetchMore: listQuery.fetchNextPage,
        listHasMore,
        listLoading: listQuery.isLoading,
        listQuery,
        method,
        one,
        options,
    };
};

export * from './methods';
