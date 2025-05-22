export interface CrudListQueryProps<Id, Item extends { id: Id }> {
    key: ReadonlyArray<any>;
    fetch: () => Promise<Item[]>;
}

export type CrudListUpdaterProps<Id, Item extends { id: Id }, Argument, Result> = {
    key: ReadonlyArray<any>;
    update: (items: Item[], result: Result, variables: Argument) => Item[];
};

export type CrudListProps<Id, Item extends { id: Id }, CreateProps, UpdateProps> = {
    key: ReadonlyArray<any>;

    create: (props: CreateProps) => Promise<Item>;
    delete: (props: { id: Id }) => Promise<void>;
    read: () => Promise<Item[]>;
    update: (props: UpdateProps & { id: Id }) => Promise<Item>;

    onCreate?: (items: Item[], createdItem: Item) => Item[];
    onDelete?: (items: Item[], deletedItemId: Id) => Item[];
    onUpdate?: (items: Item[], updatedItem: Item) => Item[];
};
