import { CrudMutation, NonNormalizedMutationProps, NormalizedMutationProps } from './types';
import { useMutation } from '@tanstack/react-query';

export const useNonNormalizedMutation = <Argument, Result>(props: NonNormalizedMutationProps<Argument, Result>) => {
    const mutation = useMutation({
        mutationFn: props.run,
        onSuccess: (result, variables) => props.update?.(result, variables),
    });
    const func = (argument: Argument) => mutation.mutateAsync(argument);
    func.mutation = mutation;
    return func as unknown as CrudMutation<Argument, Result>;
};

export const useNormalizedMutation = <Id, Item extends { id: Id }, Argument>(
    props: NormalizedMutationProps<Id, Item, Argument>,
) => {
    const mutation = useMutation({
        mutationFn: async (variables: Argument) => {
            const result = await props.run(variables);
            return { ...result, __typename: props.typename };
        },
        onSuccess: (result, variables) => props.update?.(result, variables),
    });
    const func = (argument: Argument) => mutation.mutateAsync(argument);
    func.mutation = mutation;
    return func as unknown as CrudMutation<Argument, Item & { __typename: string }>;
};
