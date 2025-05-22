import { CrudMutation, CrudMutationProps } from './types';
import { useMutation } from '@tanstack/react-query';

export const useCrudMutation = <Argument, Result>(props: CrudMutationProps<Argument, Result>) => {
    const mutation = useMutation({
        mutationFn: props.run,
        onSuccess: (result, variables) => props.update?.(result, variables),
    });
    const func = (argument: Argument) => mutation.mutateAsync(argument);
    func.mutation = mutation;
    return func as unknown as CrudMutation<Argument, Result>;
};
