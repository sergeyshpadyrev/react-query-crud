// This file can't be formatted with Prettier
import { UseMutationResult } from "@tanstack/react-query";

export type AllowedMethodName<T> = T extends BannedMethodNames ? never : T;
type BannedMethodNames = 'list' | 'listQuery' | 'options';

type IfUnknown<T, TrueType, FalseType> = unknown extends T
  ? T extends unknown
    ? TrueType
    : FalseType
  : FalseType;

  

export type AdditionalMethodFields<Argument, Name extends string, Result> = 
  { [name in Name]:
    IfUnknown<
        Argument,
        () => Promise<Result>,
        (variables: Argument) => Promise<Result>
      >} &
{ [name in Name as `${name}Mutation`]: UseMutationResult<Result, Error, Argument, unknown> };
