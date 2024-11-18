import { useMemo } from 'react';
import { CrudInfiniteListQueryProps, CrudInfiniteListUpdaterProps } from './types';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCrudInfiniteListQuery =
    <Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam>(
        props: CrudInfiniteListQueryProps<Id, Item, Page, PageParam>,
    ) =>
    () => {
        const query = useInfiniteQuery({
            getNextPageParam: (lastPage: Page | undefined, pages: Page[]) => props.getNextPageParam(lastPage, pages),
            initialPageParam: props.initialPageParam,
            queryKey: props.key,
            queryFn: async ({ pageParam }) => {
                const page = await props.fetch(pageParam as PageParam);
                return { ...page, items: page.items.map((item) => ({ ...item, __typename: props.typename })) };
            },
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
