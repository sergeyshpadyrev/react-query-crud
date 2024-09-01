import { Crud, CrudMethod, CrudMethodOptions, CrudOptions } from './types';
import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const createMethod = <Argument, Item, Result>(
    options: CrudOptions<Item>,
    method: CrudMethodOptions<Argument, Item, Result>,
): CrudMethod<Argument, Result> => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: method.run,
        onSuccess: (data, variables) =>
            queryClient.setQueryData(options.key, (item: Item | null) => method.update(item, data, variables)),
    });
    const mutationFunction = useMemo(() => {
        const func = (argument: Argument) => mutation.mutateAsync(argument);
        func.mutation = mutation;
        return func;
    }, [mutation]);
    return mutationFunction as CrudMethod<Argument, Result>;
};

export const useCrud = <Item,>(options: CrudOptions<Item>): Crud<Item> => {
    const dataQuery = useQuery({
        queryKey: options.key,
        queryFn: () => options.data(),
    });
    const data = useMemo(() => dataQuery.data, [dataQuery.data]);
    const method = <Argument, Result>(methodOptions: CrudMethodOptions<Argument, Item, Result>) =>
        createMethod(options, methodOptions);

    return {
        data: data ?? null,
        dataLoading: dataQuery.isLoading,
        dataQuery,
        method,
        options,
    };
};

export * from './methods';
