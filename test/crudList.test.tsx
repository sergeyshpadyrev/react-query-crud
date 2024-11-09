import { defaultItems } from './crudList/api';
import { describe, it, expect } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryNormalizerProvider } from '@normy/react-query';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItems } from './crudList/hook';

const defaultItemsWithTypenames = defaultItems.map((item) => ({ ...item, __typename: 'item' }));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryNormalizerProvider queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryNormalizerProvider>
);

describe('useCrudList', () => {
    it('should initialize with undefined', () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.list(), { wrapper });
        expect(items.result.current.data).toEqual(undefined);
    });

    it('should initialize with default items', async () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.list(), { wrapper });
        await items.waitFor(() => items.result.current.isSuccess);
        expect(items.result.current.data).toEqual(defaultItemsWithTypenames);
    });

    it('should add items on create', async () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.list(), { wrapper });
        await items.waitFor(() => items.result.current.isSuccess);

        await itemsAPI.result.current.create.mutateAsync({ name: 'Charlie' });
        await itemsAPI.waitFor(() => itemsAPI.result.current.create.isSuccess);
        items.rerender();

        expect(items.result.current.data).toEqual([
            ...defaultItemsWithTypenames,
            { __typename: 'item', id: 3, name: 'Charlie' },
        ]);
    });

    it('should remove items on delete', async () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.list(), { wrapper });
        await items.waitFor(() => items.result.current.isSuccess);

        await itemsAPI.result.current.delete.mutateAsync({ id: 2 });
        await itemsAPI.waitFor(() => itemsAPI.result.current.delete.isSuccess);
        items.rerender();

        expect(items.result.current.data).toEqual([defaultItemsWithTypenames[0]]);
    });

    it('should change items on update', async () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.list(), { wrapper });
        await items.waitFor(() => items.result.current.isSuccess);

        await itemsAPI.result.current.update.mutateAsync({ id: 2, name: 'Charlie' });
        await itemsAPI.waitFor(() => itemsAPI.result.current.update.isSuccess);
        items.rerender();

        expect(items.result.current.data).toEqual([
            defaultItemsWithTypenames[0],
            { ...defaultItemsWithTypenames[1], name: 'Charlie' },
        ]);
    });
});
