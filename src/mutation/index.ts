import { NonNormalizedMutationProps, NormalizedMutationProps } from './types';
import { useMutation } from '@tanstack/react-query';

export const useNonNormalizedMutation = <Argument, Result>(props: NonNormalizedMutationProps<Argument, Result>) =>
    useMutation({
        mutationFn: props.run,
        onSuccess: (result, variables) => props.update?.(result, variables),
    });

export const useNormalizedMutation = <Id, Item extends { id: Id }, Argument>(
    props: NormalizedMutationProps<Id, Item, Argument>,
) =>
    useMutation({
        mutationFn: async (variables: Argument) => {
            const result = await props.run(variables);
            return { ...result, __typename: props.typename };
        },
        onSuccess: (result, variables) => props.update?.(result, variables),
    });
