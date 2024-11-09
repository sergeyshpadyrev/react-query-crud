export interface CrudQueryProps<Id, Item extends { id: Id }> {
    key: ReadonlyArray<any>;
    fetch: () => Promise<Item>;
    typename: string;
}

export type CrudUpdaterProps<Id, Item extends { id: Id }, Argument, Result> = {
    key: ReadonlyArray<any>;
    update: (item: Item, result: Result, variables: Argument) => Item;
};
