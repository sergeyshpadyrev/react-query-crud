export interface CrudInfiniteListQueryProps<Id, Item extends { id: Id }, Page extends { items: Item[] }, PageParam> {
    getNextPageParam: (lastPage: Page | undefined, pages: Page[]) => PageParam | undefined;
    initialPageParam: PageParam;
    key: ReadonlyArray<any>;
    fetch: (pageParam: PageParam) => Promise<Page>;
}

export type CrudInfiniteListUpdaterProps<
    Id,
    Item extends { id: Id },
    Argument,
    Result,
    Page extends { items: Item[] },
    PageParam,
> = {
    key: ReadonlyArray<any>;
    update: (
        data: { pages: Page[]; pageParams: PageParam[] },
        result: Result,
        variables: Argument,
    ) => { pages: Page[]; pageParams: PageParam[] };
};
