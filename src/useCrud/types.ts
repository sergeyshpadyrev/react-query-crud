import { IfUnknown } from '../utils/types';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export interface Crud<Item> {
    data: Item | null;
    dataLoading: boolean;
    dataQuery: UseQueryResult<Item | null>;
    method: <Argument, Result>(
        methodOptions: CrudMethodOptions<Argument, Item, Result>,
    ) => CrudMethod<Argument, Result>;
    options: CrudOptions<Item>;
}

export type CrudMethod<Argument, Result> = IfUnknown<
    Argument,
    (() => Promise<Result>) & { mutation: UseMutationResult<Result, Error, Argument, unknown> },
    ((variables: Argument) => Promise<Result>) & { mutation: UseMutationResult<Result, Error, Argument, unknown> }
>;

export interface CrudMethodOptions<Argument, Item, Result> {
    run: (variables: Argument) => Promise<Result>;
    update: (item: Item | null, result: Result, variables: Argument) => Item | null;
}

export interface CrudOptions<Item> {
    data: () => Promise<Item | null>;
    key: ReadonlyArray<any>;
}
