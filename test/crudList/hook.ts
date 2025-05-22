import { createMockAPI, TestItem } from './api';
import { useCrudList, useCrudListQuery, useCrudListUpdater, useCrudMutation } from '../../src';
import { useMemo } from 'react';

export const useItems = (testId: string) => {
    const api = useMemo(createMockAPI, []);
    const key = ['items', testId];

    const onCreate = useCrudListUpdater<number, TestItem, { name: string }, TestItem>({
        key,
        update: (items, result) => [...items, result],
    });
    const onDelete = useCrudListUpdater<number, TestItem, { id: number }, void>({
        key,
        update: (items, _result, props) => items.filter((item) => item.id !== props.id),
    });
    const onUpdate = useCrudListUpdater<number, TestItem, { id: number }, TestItem>({
        key,
        update: (items, result) => items.map((item) => (item.id === result.id ? result : item)),
    });

    const create = useCrudMutation({
        run: (props: { name: string }) => api.create(props),
        update: onCreate,
    });
    const deleteMethod = useCrudMutation({
        run: (props: { id: number }) => api.delete(props),
        update: onDelete,
    });
    const read = useCrudListQuery<number, TestItem>({ key, fetch: () => api.list() });
    const update = useCrudMutation({
        run: (props: { id: number; name: string }) => api.update(props),
        update: onUpdate,
    });

    return {
        create,
        delete: deleteMethod,
        read,
        update,
    };
};

export const useItemsList = (testId: string) => {
    const api = useMemo(createMockAPI, []);
    const key = ['items', testId];

    const list = useCrudList({
        create: api.create,
        delete: api.delete,
        key,
        read: () => api.list(),
        update: api.update,
    });

    return list;
};
