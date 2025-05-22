import { defaultItems } from './crudList/api';
import { describe, it, expect } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItems } from './crudList/hook';

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCrudList', () => {
    it('should initialize with undefined', () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });

        expect(items.result.current.query.data).toEqual(undefined);
        expect(items.result.current.value).toEqual([]);
    });

    it('should initialize with default items', async () => {
        const itemsAPI = renderHook(() => useItems('filledList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        expect(items.result.current.query.data).toEqual(defaultItems);
    });

    it('should add items on create', async () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.create({ name: 'Charlie' });
        await itemsAPI.waitFor(() => itemsAPI.result.current.create.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual([...defaultItems, { id: 3, name: 'Charlie' }]);
    });

    it('should remove items on delete', async () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.delete({ id: 2 });
        await itemsAPI.waitFor(() => itemsAPI.result.current.delete.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual([defaultItems[0]]);
    });

    it('should change items on update', async () => {
        const itemsAPI = renderHook(() => useItems('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.update({ id: 2, name: 'Charlie' });
        await itemsAPI.waitFor(() => itemsAPI.result.current.update.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual([defaultItems[0], { ...defaultItems[1], name: 'Charlie' }]);
    });
});
