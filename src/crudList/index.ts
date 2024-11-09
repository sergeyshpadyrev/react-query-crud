import { CrudListQueryProps, CrudListUpdaterProps } from './types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCrudListQuery =
    <Id, Item extends { id: Id }>(props: CrudListQueryProps<Id, Item>) =>
    () =>
        useQuery({
            queryKey: props.key,
            queryFn: async () => {
                const items = await props.read();
                const orderedItems = items;
                return orderedItems.map((item) => ({ ...item, __typename: props.typename }));
            },
        });

export const useCrudListUpdater = <Id, Item extends { id: Id }, Argument, Result>(
    props: CrudListUpdaterProps<Id, Item, Argument, Result>,
) => {
    const queryClient = useQueryClient();
    return (result: Result, variables: Argument) => {
        const items = queryClient.getQueryData<Item[]>(props.key);
        if (!items) return;

        const updatedItems = props.update(items, result, variables);
        queryClient.setQueryData(props.key, updatedItems);
        return updatedItems;
    };
};
