import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CrudList, CrudListOptions } from './types';
import { useCallback, useMemo } from 'react';

export const useCrudList = <
  Id,
  Item extends { id: Id },
  ItemCreateData = Partial<Item>,
  ItemUpdateData = Partial<Item>
>(
  options: CrudListOptions<Id, Item, ItemCreateData, ItemUpdateData>
): CrudList<Id, Item, ItemCreateData, ItemUpdateData> => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (item: ItemCreateData) => options.crud.create(item),
    onSuccess: (item: Item) => {
      queryClient.setQueryData(options.key, (items: Item[] | undefined) =>
        items ? [...items, item] : [item]
      );
    },
  });
  const create = useCallback(
    (item: ItemCreateData) => createMutation.mutateAsync(item),
    [createMutation.mutateAsync]
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: Id) => options.crud.delete(id),
    onError: (
      _error: Error,
      _id: Id,
      context: { previousItems: Item[] | undefined } | undefined
    ) => {
      if (!context?.previousItems) return;
      queryClient.setQueryData(options.key, context.previousItems);
    },
    onMutate: (id: Id) => {
      const previousItems = queryClient.getQueryData(options.key) as
        | Item[]
        | undefined;
      queryClient.setQueryData(options.key, (items: Item[] | undefined) =>
        items?.filter(item => item.id !== id)
      );
      return { previousItems };
    },
  });
  const deleteFuntion = useCallback(
    (id: Id) => deleteMutation.mutateAsync(id),
    [deleteMutation.mutateAsync]
  );

  const listQuery = useQuery({
    queryKey: options.key,
    queryFn: () => options.crud.read(),
  });
  const list = useMemo(() => {
    if (!listQuery.data) return [];
    if (!options?.settings?.order) return listQuery.data;

    return options?.settings?.order(listQuery.data);
  }, [listQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (props: { id: Id; item: ItemUpdateData }) =>
      options.crud.update(props.id, props.item),
    onSuccess: (updatedItem: Item) => {
      queryClient.setQueryData(options.key, (items: Item[] | undefined) =>
        items?.map(item => (item.id === updatedItem.id ? updatedItem : item))
      );
    },
  });
  const update = useCallback(
    (id: Id, item: ItemUpdateData) => updateMutation.mutateAsync({ id, item }),
    [updateMutation.mutateAsync]
  );

  return {
    create,
    createMutation,
    delete: deleteFuntion,
    deleteMutation,
    list,
    listQuery,
    update,
    updateMutation,
  };
};
