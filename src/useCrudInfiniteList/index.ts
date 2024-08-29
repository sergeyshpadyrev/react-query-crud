import { AdditionalMethodFields } from './types.unformatted';
import { useCallback, useMemo } from 'react';
import { CrudInfiniteList, CrudInfiniteListMethodOptions, CrudInfiniteListOptions } from './types';
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const withAdditionalMethod = <
    CrudListType extends CrudInfiniteList<Id, Item, Page, PageParam>,
    Id,
    Item extends { id: Id },
    Page extends { items: Item[] },
    PageParam
>(
    controller: CrudListType,
    key: ReadonlyArray<any>,
) => <Name extends string, Result, Argument>(
    props: CrudInfiniteListMethodOptions<Argument, Id, Item, Name, Page, Result>,
) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: props.run,
        onSuccess: (data, variables) =>
            queryClient.setQueryData(key, ({ pages }: { pageParams: PageParam[]; pages: Page[] | undefined }) => {
                const newPages = props.update(pages ?? [], data, variables);
                return {
                    pageParams: newPages.reduce(
                        acc => ({
                            params: [controller.options.listPageParam(acc.restPages), ...acc.params],
                            restPages: acc.restPages.slice(0, acc.restPages.length - 1),
                        }),
                        { params: [], restPages: [] } as {
                            params: PageParam[];
                            restPages: Page[];
                        },
                    ).params,
                    pages: newPages,
                };
            }),
    });
    const mutationFunction = useCallback((argument: Argument) => mutation.mutateAsync(argument), [
        mutation.mutateAsync,
    ]);

    const extendedController = {
        ...controller,
        ...({
            [props.name]: mutationFunction,
            [props.name + 'Mutation']: mutation,
        } as AdditionalMethodFields<Argument, Name, Result>),
    };

    return {
        ...extendedController,
        addMethod: withAdditionalMethod<
            CrudListType & AdditionalMethodFields<Argument, Name, Result>,
            Id,
            Item,
            Page,
            PageParam
        >(extendedController, key),
    };
};

export const useCrudInfiniteList = <Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam>(
    options: CrudInfiniteListOptions<Id, Item, Page, PageParam>,
) => {
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

    const controller: CrudInfiniteList<Id, Item, Page, PageParam> = {
        list,
        listFetchMore: listQuery.fetchNextPage,
        listHasMore,
        listLoading: listQuery.isLoading,
        listQuery,
        options,
    };

    return {
        ...controller,
        addMethod: withAdditionalMethod<CrudInfiniteList<Id, Item, Page, PageParam>, Id, Item, Page, PageParam>(
            controller,
            options.key,
        ),
    };
};

export * from './methods';
