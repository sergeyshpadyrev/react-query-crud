export interface CrudListQueryProps<Id, Item extends { id: Id }> {
    key: ReadonlyArray<any>;
    fetch: () => Promise<Item[]>;
    typename: string;
}

export type CrudListUpdaterProps<Id, Item extends { id: Id }, Argument, Result> = {
    key: ReadonlyArray<any>;
    update: (items: Item[], result: Result, variables: Argument) => Item[];
};

export type CrudListProps<Id, Item extends { id: Id }, CreateProps, UpdateProps> = {
    key: ReadonlyArray<any>;
    typename: string;

    create: (props: CreateProps) => Promise<Item>;
    delete: (props: { id: Id }) => Promise<void>;
    read: () => Promise<Item[]>;
    update: (props: UpdateProps & { id: Id }) => Promise<Item>;

    onCreate?: (items: Item[], createdItem: Item) => Item[];
    onDelete?: (items: Item[], deletedItemId: Id) => Item[];
};
