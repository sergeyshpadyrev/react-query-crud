export interface CrudQueryProps<Id, Item extends { id: Id }> {
    key: ReadonlyArray<any>;
    fetch: () => Promise<Item | null | undefined>;
    typename: string;
}

export type CrudUpdaterProps<Id, Item extends { id: Id }, Argument, Result> = {
    key: ReadonlyArray<any>;
    update: (item: Item | undefined, result: Result, variables: Argument) => Item | undefined;
};
