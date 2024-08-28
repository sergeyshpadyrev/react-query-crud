import { useMemo } from 'react';
import { CrudInfiniteListOptions } from './types';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useCrudInfiniteList = <
  Id,
  Item extends { id: Id },
  Page extends { items: Item[] },
  PageParam
>(
  options: CrudInfiniteListOptions<Id, Item, Page, PageParam>
) => {
  const listQuery = useInfiniteQuery<Page, Error>({
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

  const controller = {
    list,
    listQuery,
    options,
  };

  return controller;
};

export * from './types';
