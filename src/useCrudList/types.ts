import { AllowedMethodName } from './types.unformatted';
import { UseQueryResult } from '@tanstack/react-query';

export interface CrudList<Id, Item extends { id: Id }> {
  list: Item[];
  listQuery: UseQueryResult<Item[]>;
  options: CrudListOptions<Id, Item>;
}

export interface CrudListOptions<Id, Item extends { id: Id }> {
  key: ReadonlyArray<any>;
  list: () => Promise<Item[]>;
  listOrder?: (items: Item[]) => Item[];
}

export interface CrudListMethodOptions<
  Argument,
  Id,
  Item extends { id: Id },
  Name extends string,
  Result
> {
  name: AllowedMethodName<Name>;
  run: (variables: Argument) => Promise<Result>;
  update: (items: Item[], result: Result, variables: Argument) => Item[];
}
