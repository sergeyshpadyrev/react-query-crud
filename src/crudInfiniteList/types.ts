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

export type CrudInfiniteListProps<
    Id,
    Item extends { id: Id },
    CreateProps,
    UpdateProps,
    Page extends { items: Item[] },
    PageParam,
> = {
    key: ReadonlyArray<any>;

    defaultPageParam: PageParam;
    nextPageParam: (pages: Page[]) => PageParam | undefined;

    create: (props: CreateProps) => Promise<Item>;
    delete: (props: { id: Id }) => Promise<void>;
    read: (pageParam: PageParam) => Promise<Page>;
    update: (props: UpdateProps & { id: Id }) => Promise<Item>;

    onCreate: (
        data: {
            pages: Page[];
            pageParams: PageParam[];
        },
        createdItem: Item,
    ) => { pages: Page[]; pageParams: PageParam[] };
    onDelete: (
        data: {
            pages: Page[];
            pageParams: PageParam[];
        },
        deletedItemId: Id,
    ) => { pages: Page[]; pageParams: PageParam[] };
    onUpdate: (
        data: {
            pages: Page[];
            pageParams: PageParam[];
        },
        updatedItem: Item,
    ) => { pages: Page[]; pageParams: PageParam[] };
};
