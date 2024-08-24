import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CrudList, CrudListOptions } from './types';
import { useCallback, useMemo } from 'react';

export const useCrudList = <
  Item extends { id: Id },
  Id,
  ItemCreateData = Partial<Item>,
  ItemUpdateData = Partial<Item>
>(
  options: CrudListOptions<Item, Id, ItemCreateData, ItemUpdateData>
): CrudList<Item, Id, ItemCreateData, ItemUpdateData> => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (item: ItemCreateData) => options.create(item),
    onSuccess: (item: Item) => {
      queryClient.setQueryData(options.listKey, (items: Item[] | undefined) =>
        items ? [...items, item] : [item]
      );
    },
  });
  const create = useCallback(
    (item: ItemCreateData) => createMutation.mutateAsync(item),
    [createMutation.mutateAsync]
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: Id) => options.delete(id),
    onError: (
      error: Error,
      id: Id,
      context: { previousItems: Item[] | undefined } | undefined
    ) => {
      if (!context?.previousItems) return;
      queryClient.setQueryData(options.listKey, context.previousItems);
    },
    onMutate: (id: Id) => {
      const previousItems = queryClient.getQueryData(options.listKey) as
        | Item[]
        | undefined;
      queryClient.setQueryData(options.listKey, (items: Item[] | undefined) =>
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
    queryKey: options.listKey,
    queryFn: () => options.list(),
  });
  const list = useMemo(() => {
    if (!listQuery.data) return [];
    if (!options.listOrder) return listQuery.data;

    return options.listOrder(listQuery.data);
  }, [listQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (props: { id: Id; item: ItemUpdateData }) =>
      options.update(props.id, props.item),
    onSuccess: (updatedItem: Item) => {
      queryClient.setQueryData(options.listKey, (items: Item[] | undefined) =>
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
