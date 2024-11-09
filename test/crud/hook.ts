import { createMockAPI } from './api';
import { useCrudQuery } from '../../src';
import { useMemo } from 'react';

export const useItem = (testId: string) => {
    const api = useMemo(createMockAPI, []);

    const read = useCrudQuery({
        key: ['item', testId],
        fetch: () => api.get(),
        typename: 'item',
    });

    return { read };
};
