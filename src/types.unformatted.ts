// This file can't be formatted with Prettier
import { UseMutationResult } from "@tanstack/react-query";
import { IfUnknown } from "./types";

export type CustomMutationFields<Argument, Name extends string, Result> = 
  { [name in Name]:
    IfUnknown<
        Argument,
        () => Promise<Result>,
        (variables: Argument) => Promise<Result>
      >} &
{ [name in Name as `${name}Mutation`]: UseMutationResult<Result, Error, Argument, unknown> };
