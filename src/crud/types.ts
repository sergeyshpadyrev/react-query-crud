export interface CrudQueryProps<Id, Item extends { id: Id }> {
    key: ReadonlyArray<any>;
    fetch: () => Promise<Item | null>;
}

export type CrudUpdaterProps<Id, Item extends { id: Id }, Argument, Result> = {
    key: ReadonlyArray<any>;
    update: (item: Item | null, result: Result, variables: Argument) => Item | null;
};
