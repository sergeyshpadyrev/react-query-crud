import { createMockAPI } from './api.mock';
import { CrudListMethods, useCrudList } from '../src';
import { useMemo } from 'react';

export const useItems = () => {
  const api = useMemo(createMockAPI, []);

  return useCrudList({
    key: ['items'],
    list: () => api.list(),
  })
    .addMethod(CrudListMethods.create(api.create))
    .addMethod(CrudListMethods.delete(api.delete))
    .addMethod(CrudListMethods.update(api.update))
    .addMethod({
      name: 'recreate',
      run: (id: number) => api.recreate(id),
      update: (items, result, oldId) => [
        ...items.filter(item => item.id !== oldId),
        result,
      ],
    })
    .addMethod({ name: 'clear', run: () => api.clear(), update: () => [] });
};
