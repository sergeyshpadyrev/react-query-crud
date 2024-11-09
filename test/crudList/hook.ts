import { createMockAPI, TestItem } from './api';
import { useCrudListQuery, useCrudListUpdater, useNonNormalizedMutation, useNormalizedMutation } from '../../src';
import { useMemo } from 'react';

export const useItems = (testId: string) => {
    const api = useMemo(createMockAPI, []);

    const key = ['items', testId];
    const typename = 'item';

    const onCreate = useCrudListUpdater<number, TestItem, { name: string }, TestItem>({
        key,
        update: (items, result) => [...items, result],
    });
    const onDelete = useCrudListUpdater<number, TestItem, { id: number }, void>({
        key,
        update: (items, _result, props) => items.filter((item) => item.id !== props.id),
    });

    const create = useNormalizedMutation({
        run: (props: { name: string }) => api.create(props),
        update: onCreate,
        typename,
    });
    const deleteMethod = useNonNormalizedMutation({
        run: (props: { id: number }) => api.delete(props),
        update: onDelete,
    });
    const list = useCrudListQuery<number, TestItem>({ key, read: () => api.list(), typename });
    const update = useNormalizedMutation({
        run: (props: { id: number; name: string }) => api.update(props),
        typename,
    });

    return {
        create,
        delete: deleteMethod,
        list,
        update,
    };
};
