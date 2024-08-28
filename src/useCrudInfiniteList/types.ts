import { AllowedMethodName } from './types.unformatted';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

export interface CrudInfiniteList<
  Id,
  Item extends { id: Id },
  Page extends { items: Item[] },
  PageParam
> {
  list: Item[];
  listFetchMore: () => void;
  listHasMore: boolean;
  listQuery: UseInfiniteQueryResult<InfiniteData<Page, PageParam>>;
  options: CrudInfiniteListOptions<Id, Item, Page, PageParam>;
}

export interface CrudInfiniteListOptions<
  Id,
  Item extends { id: Id },
  Page extends { items: Item[] },
  PageParam
> {
  key: ReadonlyArray<any>;
  list: (pageParam: PageParam) => Promise<Page>;
  listHasMore: (pages: Page[]) => boolean;
  listPageParam: (pages: Page[]) => PageParam;
  listOrder?: (items: Item[]) => Item[];
}

export interface CrudInfiniteListMethodOptions<
  Argument,
  Id,
  Item extends { id: Id },
  Name extends string,
  Result
> {
  name: AllowedMethodName<Name>;
  run: (variables: Argument) => Promise<Result>;
  update: (items: Item[], result: Result, variables: Argument) => Item[];
}
