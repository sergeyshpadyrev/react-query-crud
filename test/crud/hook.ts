import { createMockAPI, TestItem } from './api';
import { useCrudQuery, useCrudUpdater, useNonNormalizedMutation, useNormalizedMutation } from '../../src';
import { useMemo } from 'react';

export const useItem = (testId: string) => {
    const api = useMemo(createMockAPI, []);

    const key = ['item', testId];
    const typename = 'item';

    const onCreate = useCrudUpdater<number, TestItem, { name: string }, TestItem>({
        key,
        update: (_item, result) => result,
    });
    const onDelete = useCrudUpdater<number, TestItem, unknown, void>({
        key,
        update: () => null,
    });

    const create = useNormalizedMutation({
        run: (props: { name: string }) => api.create(props),
        update: onCreate,
        typename,
    });
    const del = useNonNormalizedMutation({
        run: () => api.delete(),
        update: onDelete,
    });
    const read = useCrudQuery({
        key,
        fetch: () => api.get(),
        typename,
    });
    const update = useNormalizedMutation({
        run: (props: { id: number; name: string }) => api.update(props),
        typename,
    });

    return { create, delete: del, read, update };
};
