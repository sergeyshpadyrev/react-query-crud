// This file can't be formatted with Prettier
import { UseMutationResult } from "@tanstack/react-query";

export type CustomMutationFields<Argument, Name extends string, Result> = 
  { [name in Name]: (argument: Argument) => Promise<Result> } &
{ [name in Name as `${name}Mutation`]: UseMutationResult<Result, Error, Argument, unknown> };
