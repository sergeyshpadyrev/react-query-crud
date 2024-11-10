import { defaultItems } from './crudInfiniteList/api';
import { describe, it, expect } from '@jest/globals';
import { QueryClient } from '@tanstack/react-query';
import { QueryCrudClientProvider } from '../src';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItems } from './crudInfiniteList/hook';

const defaultItemsWithTypenames = defaultItems.map((item) => ({ ...item, __typename: 'item' }));
const limit = 5;

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryCrudClientProvider client={queryClient}>{children}</QueryCrudClientProvider>
);

describe('useCrudList', () => {
    it('should initialize with undefined', () => {
        const itemsAPI = renderHook(() => useItems('emptyInfiniteList', limit), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        expect(items.result.current.data).toEqual(undefined);
    });

    it('should initialize with default items', async () => {
        const itemsAPI = renderHook(() => useItems('filledInfiniteList', limit), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.isSuccess);

        expect(items.result.current.data).toEqual({
            pages: [{ canFetchMore: true, items: defaultItemsWithTypenames.slice(0, limit) }],
            pageParams: [0],
        });
    });
});
