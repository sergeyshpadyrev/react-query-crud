import { AdditionalMethodFields } from './types.unformatted';
import { CrudList, CrudListMethodOptions, CrudListOptions } from './types';
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const withAdditionalMethod = <CrudListType extends CrudList<Id, Item>, Id, Item extends { id: Id }>(
    controller: CrudListType,
    key: ReadonlyArray<any>,
) => <Name extends string, Result, Argument>(props: CrudListMethodOptions<Argument, Id, Item, Name, Result>) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: props.run,
        onSuccess: (data, variables) =>
            queryClient.setQueryData(key, (items: Item[] | undefined) => props.update(items ?? [], data, variables)),
    });
    const mutationFunction = useCallback((argument: Argument) => mutation.mutateAsync(argument), [
        mutation.mutateAsync,
    ]);

    const extendedController = {
        ...controller,
        ...({
            [props.name]: mutationFunction,
            [props.name + 'Mutation']: mutation,
        } as AdditionalMethodFields<Argument, Name, Result>),
    };

    return {
        ...extendedController,
        addMethod: withAdditionalMethod<CrudListType & AdditionalMethodFields<Argument, Name, Result>, Id, Item>(
            extendedController,
            key,
        ),
    };
};

export const useCrudList = <Id, Item extends { id: Id }>(options: CrudListOptions<Id, Item>) => {
    const listQuery = useQuery({
        queryKey: options.key,
        queryFn: () => options.list(),
    });
    const list = useMemo(() => {
        if (!listQuery.data) return [];
        if (!options.listOrder) return listQuery.data;

        return options.listOrder(listQuery.data);
    }, [listQuery.data]);

    const controller: CrudList<Id, Item> = {
        list,
        listLoading: listQuery.isLoading,
        listQuery,
        options,
    };

    return {
        ...controller,
        addMethod: withAdditionalMethod<CrudList<Id, Item>, Id, Item>(controller, options.key),
    };
};

export * from './methods';
