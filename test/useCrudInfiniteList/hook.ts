import { createMockAPI } from './api.mock';
import { CrudInfiniteListMethods, useCrudInfiniteList } from '../../src';
import { useMemo } from 'react';

export const useItems = (limit: number = 5) => {
  const api = useMemo(createMockAPI, []);

  return useCrudInfiniteList({
    key: ['items'],
    list: (offset: number) => api.list(offset, limit),
    listHasMore: pages =>
      pages.length > 0 ? pages[pages.length - 1].canFetchMore : true,
    listPageParam: pages =>
      pages.reduce((acc, page) => acc + page.items.length, 0),
  }).addMethod(CrudInfiniteListMethods.create(api.create));
};
