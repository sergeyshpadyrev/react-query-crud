import { createMockAPI } from './api.mock';
import { useCrudList } from '../src';
import { useMemo } from 'react';

export const useItems = () => {
  const api = useMemo(createMockAPI, []);
  const apiHook = useCrudList({
    crud: {
      create: api.create,
      delete: api.delete,
      read: api.read,
      update: api.update,
    },
    key: ['items'],
  });

  const extendedHook = apiHook.withCustomMutation({
    name: 'recreate',
    run: (id: number) => api.recreate(id),
    update: (items, result, oldId) => [
      ...items.filter(item => item.id !== oldId),
      result,
    ],
  });

  return extendedHook;
};
