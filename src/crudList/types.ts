export interface CrudListQueryProps<Id, Item extends { id: Id }> {
    key: ReadonlyArray<any>;
    read: () => Promise<Item[]>;
    typename: string;
}

export type CrudListUpdaterProps<Id, Item extends { id: Id }, Argument, Result> = {
    key: ReadonlyArray<any>;
    update: (items: Item[], result: Result, variables: Argument) => Item[];
};
