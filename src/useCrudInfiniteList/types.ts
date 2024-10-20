import { Crud } from '../useCrud/types';
import { InfiniteData, UseInfiniteQueryResult, UseMutationResult } from '@tanstack/react-query';
import { IfUnknown } from '../utils/types';

export interface CrudInfiniteList<Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam> {
    list: Item[];
    listFetchMore: () => void;
    listHasMore: boolean;
    listLoading: boolean;
    listQuery: UseInfiniteQueryResult<InfiniteData<Page, PageParam>>;
    method: <Argument, Result>(
        methodOptions: CrudInfiniteListMethodOptions<Argument, Id, Item, Page, Result>,
    ) => CrudInfiniteListMethod<Argument, Result>;
    one: (fetch: (id: Id) => Promise<Item | null>) => (id: Id) => Crud<Item>;
    options: CrudInfiniteListOptions<Id, Item, Page, PageParam>;
}

export interface CrudInfiniteListOptions<Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam> {
    key: ReadonlyArray<any>;
    list: (pageParam: PageParam) => Promise<Page>;
    listHasMore: (pages: Page[]) => boolean;
    listPageParam: (pages: Page[]) => PageParam | undefined;
    listOrder?: (items: Item[]) => Item[];
}

export type CrudInfiniteListMethod<Argument, Result> = IfUnknown<
    Argument,
    (() => Promise<Result>) & { mutation: UseMutationResult<Result, Error, Argument, unknown> },
    ((variables: Argument) => Promise<Result>) & { mutation: UseMutationResult<Result, Error, Argument, unknown> }
>;

export interface CrudInfiniteListMethodOptions<
    Argument,
    Id,
    Item extends { id: Id },
    Page extends { items: Item[] },
    Result,
> {
    run: (variables: Argument) => Promise<Result>;
    update: (pages: Page[], result: Result, variables: Argument) => Page[];
    updateOne?: (item: any | null, result: Result, variables: Argument) => any | null;
}
