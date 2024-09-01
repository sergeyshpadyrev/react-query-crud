import { createMockAPI } from './api.mock';
import { CrudListMethods, useCrudList } from '../../dist';
import { useMemo } from 'react';

export const useItems = (testId: string) => {
    const api = useMemo(createMockAPI, []);

    const crud = useCrudList({
        key: ['items', testId],
        list: () => api.list(),
    });

    return {
        ...crud,
        clear: crud.method({ run: () => api.clear(), update: () => [] }),
        create: crud.method(CrudListMethods.create(api.create)),
        delete: crud.method(CrudListMethods.delete(api.delete)),
        recreate: crud.method({
            run: (id: number) => api.recreate(id),
            update: (items, result, oldId) => [...items.filter((item) => item.id !== oldId), result],
        }),
        update: crud.method(CrudListMethods.update(api.update)),
    };
};
