import { defaultItem } from './crud/api';
import { describe, it, expect } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItem } from './crud/hook';

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCrud', () => {
    it('should initialize with undefined', () => {
        const itemAPI = renderHook(() => useItem('empty'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        expect(item.result.current.value).toEqual(undefined);
    });

    it('should initialize with default item', async () => {
        const itemAPI = renderHook(() => useItem('filled'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        await item.waitFor(() => item.result.current.query.isSuccess);
        expect(item.result.current.value).toEqual(defaultItem);
    });

    it('should change item on update', async () => {
        const itemAPI = renderHook(() => useItem('filled'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        await item.waitFor(() => item.result.current.query.isSuccess);

        await itemAPI.result.current.update({ id: 1, name: 'Bob' });
        await itemAPI.waitFor(() => itemAPI.result.current.update.mutation.isSuccess);
        item.rerender();

        expect(item.result.current.value).toEqual({ id: 1, name: 'Bob' });
    });

    it('should remove item on delete', async () => {
        const itemAPI = renderHook(() => useItem('filled'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        await item.waitFor(() => item.result.current.query.isSuccess);

        await itemAPI.result.current.delete();
        await itemAPI.waitFor(() => itemAPI.result.current.delete.mutation.isSuccess);
        item.rerender();

        expect(item.result.current.value).toBeNull();
    });

    it('should add item on create', async () => {
        const itemAPI = renderHook(() => useItem('filled'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        await item.waitFor(() => item.result.current.query.isSuccess);

        await itemAPI.result.current.create({ name: 'Bob' });
        await itemAPI.waitFor(() => itemAPI.result.current.create.mutation.isSuccess);
        item.rerender();

        expect(item.result.current.value).toEqual({ id: 2, name: 'Bob' });
    });
});
