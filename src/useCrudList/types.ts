import { IfUnknown } from '../utils/types';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export interface CrudList<Id, Item extends { id: Id }> {
    list: Item[];
    listLoading: boolean;
    listQuery: UseQueryResult<Item[]>;
    method: <Argument, Result>(
        methodOptions: CrudListMethodOptions<Argument, Id, Item, Result>,
    ) => CrudListMethod<Argument, Result>;
    options: CrudListOptions<Id, Item>;
}

export type CrudListMethod<Argument, Result> = IfUnknown<
    Argument,
    (() => Promise<Result>) & { mutation: UseMutationResult<Result, Error, Argument, unknown> },
    ((variables: Argument) => Promise<Result>) & { mutation: UseMutationResult<Result, Error, Argument, unknown> }
>;

export interface CrudListMethodOptions<Argument, Id, Item extends { id: Id }, Result> {
    run: (variables: Argument) => Promise<Result>;
    update: (items: Item[], result: Result, variables: Argument) => Item[];
}

export interface CrudListOptions<Id, Item extends { id: Id }> {
    key: ReadonlyArray<any>;
    list: () => Promise<Item[]>;
    listOrder?: (items: Item[]) => Item[];
}
