import { CrudList, CrudListMethod, CrudListMethodOptions, CrudListOptions } from './types';
import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const createMethod = <Argument, Id, Item extends { id: Id }, Result>(
    options: CrudListOptions<Id, Item>,
    method: CrudListMethodOptions<Argument, Id, Item, Result>,
) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: method.run,
        onSuccess: (data, variables) =>
            queryClient.setQueryData(options.key, (items: Item[] | undefined) =>
                method.update(items ?? [], data, variables),
            ),
    });
    const mutationFunction = useMemo(() => {
        const func = (argument: Argument) => mutation.mutateAsync(argument);
        func.mutation = mutation;
        return func;
    }, [mutation]);
    return mutationFunction as CrudListMethod<Argument, Result>;
};

export const useCrudList = <Id, Item extends { id: Id }>(options: CrudListOptions<Id, Item>): CrudList<Id, Item> => {
    const listQuery = useQuery({
        queryKey: options.key,
        queryFn: () => options.list(),
    });
    const list = useMemo(() => {
        if (!listQuery.data) return [];
        if (!options.listOrder) return listQuery.data;

        return options.listOrder(listQuery.data);
    }, [listQuery.data]);
    const method = <Argument, Result>(methodOptions: CrudListMethodOptions<Argument, Id, Item, Result>) =>
        createMethod(options, methodOptions);

    return {
        list,
        listLoading: listQuery.isLoading,
        listQuery,
        method,
        options,
    };
};

export * from './methods';
