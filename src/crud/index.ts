import { CrudQueryProps, CrudUpdaterProps } from './types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useCrudQuery =
    <Id, Item extends { id: Id }>(props: CrudQueryProps<Id, Item>) =>
    () => {
        const query = useQuery({
            queryKey: props.key,
            queryFn: props.fetch,
        });
        return { query, value: query.data };
    };

export const useCrudUpdater = <Id, Item extends { id: Id }, Argument, Result>(
    props: CrudUpdaterProps<Id, Item, Argument, Result>,
) => {
    const queryClient = useQueryClient();
    return (result: Result, variables: Argument) => {
        const item = queryClient.getQueryData<Item>(props.key);
        if (!item) return;

        const updatedItem = props.update(item, result, variables);
        queryClient.setQueryData(props.key, updatedItem);
    };
};
