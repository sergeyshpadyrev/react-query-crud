import { useMutation, useQuery } from '@tanstack/react-query';
import { CrudList, CrudListOptions } from './types';
import { useCallback } from 'react';

export const useCrudList = <
  Item extends { id: Id },
  Id,
  ItemCreateData = Partial<Item>,
  ItemUpdateData = Partial<Item>
>(
  options: CrudListOptions<Item, Id, ItemCreateData, ItemUpdateData>
): CrudList<Item, Id, ItemCreateData, ItemUpdateData> => {
  const createMutation = useMutation({
    mutationFn: (item: ItemCreateData) => options.create(item),
  });
  const create = useCallback(
    (item: ItemCreateData) => createMutation.mutateAsync(item),
    [createMutation.mutateAsync]
  );

  const deleteMutation = useMutation({
    mutationFn: (id: Id) => options.delete(id),
  });
  const deleteFuntion = useCallback(
    (id: Id) => deleteMutation.mutateAsync(id),
    [deleteMutation.mutateAsync]
  );

  const listQuery = useQuery({
    queryKey: options.key,
    queryFn: () => options.list(),
  });

  const updateMutation = useMutation({
    mutationFn: (props: { id: Id; item: ItemUpdateData }) =>
      options.update(props.id, props.item),
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
    list: listQuery.data ?? [],
    listQuery,
    update,
    updateMutation,
  };
};
