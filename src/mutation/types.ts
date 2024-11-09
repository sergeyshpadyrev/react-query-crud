export type NonNormalizedMutationProps<Argument, Result> = {
    run: (variables: Argument) => Promise<Result>;
    update?: (result: Result, variables: Argument) => void;
};

export type NormalizedMutationProps<Id, Item extends { id: Id }, Argument> = {
    run: (variables: Argument) => Promise<Item>;
    update?: (result: Item, variables: Argument) => void;
    typename: string;
};
