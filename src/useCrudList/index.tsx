import { AdditionalMethodFields, AllowedMethodName } from './types.unformatted';
import { CrudList, CrudListOptions } from './types';
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const withAdditionalMethod = <CrudListType, Item>(
  controller: CrudListType,
  key: ReadonlyArray<any>
) => <Name extends string, Result, Argument>(props: {
  name: AllowedMethodName<Name>;
  run: (variables: Argument) => Promise<Result>;
  update: (items: Item[], result: Result, variables: Argument) => Item[];
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: props.run,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(key, (items: Item[] | undefined) =>
        props.update(items ?? [], data, variables)
      );
    },
  });
  const mutationFunction = useCallback(
    (argument: Argument) => mutation.mutateAsync(argument),
    [mutation.mutateAsync]
  );

  const extendedController = {
    ...controller,
    ...({
      [props.name]: mutationFunction,
      [props.name + 'Mutation']: mutation,
    } as AdditionalMethodFields<Argument, Name, Result>),
  };

  return {
    ...extendedController,
    addMethod: withAdditionalMethod<
      CrudListType & AdditionalMethodFields<Argument, Name, Result>,
      Item
    >(extendedController, key),
  };
};

export const useCrudList = <Id, Item extends { id: Id }>(
  options: CrudListOptions<Id, Item>
) => {
  const listQuery = useQuery({
    queryKey: options.key,
    queryFn: () => options.list(),
  });
  const list = useMemo(() => {
    if (!listQuery.data) return [];
    if (!options.listOrder) return listQuery.data;

    return options.listOrder(listQuery.data);
  }, [listQuery.data]);

  const controller = {
    list,
    listQuery,
    options,
  };

  return {
    ...controller,
    addMethod: withAdditionalMethod<CrudList<Id, Item>, Item>(
      controller,
      options.key
    ),
  };
};

export * from './methods';
export * from './types';
