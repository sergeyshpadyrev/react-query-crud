import { useMemo } from 'react';
import { CrudInfiniteList, CrudInfiniteListOptions } from './types';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

export const useCrudInfiniteList = <
  Id,
  Item extends { id: Id },
  Page extends { items: Item[] },
  PageParam
>(
  options: CrudInfiniteListOptions<Id, Item, Page, PageParam>
) => {
  const listQuery = useInfiniteQuery<
    Page,
    Error,
    InfiniteData<Page, PageParam>
  >({
    getNextPageParam: (_lastPage: Page, pages: Page[]) =>
      options.listPageParam(pages),
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
    listQuery,
    options,
  };

  return controller;
};

export * from './types';
