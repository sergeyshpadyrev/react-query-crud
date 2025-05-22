import { useMemo } from 'react';
import { CrudListProps, CrudListQueryProps, CrudListUpdaterProps } from './types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCrudMutation } from '../mutation';

export const useCrudListQuery =
    <Id, Item extends { id: Id }>(props: CrudListQueryProps<Id, Item>) =>
    () => {
        const query = useQuery({
            queryKey: props.key,
            queryFn: props.fetch,
        });
        const value = useMemo(() => query.data ?? [], [query.data]);

        return { query, value };
    };

export const useCrudListUpdater = <Id, Item extends { id: Id }, Argument, Result>(
    props: CrudListUpdaterProps<Id, Item, Argument, Result>,
) => {
    const queryClient = useQueryClient();
    return (result: Result, variables: Argument) => {
        const items = queryClient.getQueryData<Item[]>(props.key);
        if (!items) return;

        const updatedItems = props.update(items, result, variables);
        queryClient.setQueryData(props.key, updatedItems);
    };
};

export const useCrudList = <Id, Item extends { id: Id }, CreateProps, UpdateProps>(
    props: CrudListProps<Id, Item, CreateProps, UpdateProps>,
) => {
    const onCreate = useCrudListUpdater<Id, Item, CreateProps, Item>({
        key: props.key,
        update: (items, result) => props.onCreate?.(items, result) ?? [...items, result],
    });
    const onDelete = useCrudListUpdater<Id, Item, { id: Id }, void>({
        key: props.key,
        update: (items, _result, params) =>
            props.onDelete?.(items, params.id) ?? items.filter((item) => item.id !== params.id),
    });
    const onUpdate = useCrudListUpdater<Id, Item, { id: Id }, Item>({
        key: props.key,
        update: (items, result) =>
            props.onUpdate?.(items, result) ?? items.map((item) => (item.id === result.id ? result : item)),
    });

    const create = useCrudMutation({
        run: props.create,
        update: onCreate,
    });
    const del = useCrudMutation({
        run: props.delete,
        update: onDelete,
    });
    const read = useCrudListQuery<Id, Item>({ key: props.key, fetch: () => props.read() });
    const update = useCrudMutation({
        run: (params: UpdateProps & { id: Id }) => props.update(params),
        update: onUpdate,
    });

    return {
        create,
        delete: del,
        read,
        update,
    };
};
