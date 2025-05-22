import { createMockAPI, TestItem } from './api';
import { useCrudQuery, useCrudUpdater, useCrudMutation } from '../../src';
import { useMemo } from 'react';

export const useItem = (testId: string) => {
    const api = useMemo(createMockAPI, []);
    const key = ['item', testId];

    const onCreate = useCrudUpdater<number, TestItem, { name: string }, TestItem>({
        key,
        update: (_item, result) => result,
    });
    const onDelete = useCrudUpdater<number, TestItem, unknown, void>({
        key,
        update: () => null,
    });
    const onUpdate = useCrudUpdater<number, TestItem, unknown, TestItem>({
        key,
        update: (_item, result) => result,
    });

    const create = useCrudMutation({
        run: (props: { name: string }) => api.create(props),
        update: onCreate,
    });
    const del = useCrudMutation({
        run: () => api.delete(),
        update: onDelete,
    });
    const read = useCrudQuery({
        key,
        fetch: () => api.get(),
    });
    const update = useCrudMutation({
        run: (props: { id: number; name: string }) => api.update(props),
        update: onUpdate,
    });

    return { create, delete: del, read, update };
};
