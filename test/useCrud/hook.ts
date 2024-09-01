import { CrudMethods, useCrud } from '../../dist';
import { createMockAPI } from './api.mock';
import { useMemo } from 'react';

export const useItem = (testId: string) => {
    const api = useMemo(createMockAPI, []);

    const crud = useCrud({
        key: ['item', testId],
        data: () => api.get(),
    });

    return {
        ...crud,
        create: crud.method(CrudMethods.create(api.create)),
        delete: crud.method(CrudMethods.delete(api.delete)),
        update: crud.method(CrudMethods.update(api.update)),
    };
};
