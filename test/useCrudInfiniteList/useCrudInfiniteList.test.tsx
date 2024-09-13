import { defaultItems } from './api.mock';
import { describe, it, expect } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItem, useItems } from './hook';

const limit = 5;

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
const hookProps = { wrapper };

describe('useCrudInfiniteList', () => {
    it('should initialize with an empty list', () => {
        const hook = renderHook(() => useItems('emptyList', limit), hookProps);
        expect(hook.result.current.list).toEqual([]);
    });

    it('should return items after loading', async () => {
        const hook = renderHook(() => useItems('itemsAfterLoading', limit), {
            wrapper,
        });
        await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

        expect(hook.result.current.list).toEqual(defaultItems.slice(0, limit));
    });

    it('should add items on create', async () => {
        const hook = renderHook(() => useItems('onCreate', limit), hookProps);
        await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

        await hook.result.current.create({ name: 'Charlie' });
        await hook.waitFor(() => hook.result.current.create.mutation.isSuccess);
        expect(hook.result.current.list).toEqual([{ id: 11, name: 'Charlie' }, ...defaultItems.slice(0, limit)]);
    });

    it('should remove items on delete', async () => {
        const hook = renderHook(() => useItems('onDelete', limit), hookProps);
        await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

        await hook.result.current.delete({ id: 1 });
        await hook.waitFor(() => hook.result.current.delete.mutation.isSuccess);
        expect(hook.result.current.list).toEqual(defaultItems.slice(1, limit));
    });

    it('should change items on update', async () => {
        const hook = renderHook(() => useItems('onUpdate', limit), hookProps);
        await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

        await hook.result.current.update({ id: 1, data: { name: 'Charlie' } });
        await hook.waitFor(() => hook.result.current.update.mutation.isSuccess);

        expect(hook.result.current.list).toEqual([{ id: 1, name: 'Charlie' }, ...defaultItems.slice(1, 5)]);
    });

    it('should get one', async () => {
        const hook = renderHook(() => useItems('one', limit), hookProps);
        await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

        const anotherHook = renderHook(() => useItem('one', 1, hook.result.current.api), hookProps);
        await anotherHook.waitFor(() => anotherHook.result.current.dataQuery.isSuccess);

        expect(anotherHook.result.current.data).toEqual({ id: 1, name: 'Alice' });

        await hook.result.current.update({ id: 1, data: { name: 'Charlie' } });
        await hook.waitFor(() => hook.result.current.update.mutation.isSuccess);

        expect(anotherHook.result.current.data).toEqual({ id: 1, name: 'Charlie' });

        await hook.result.current.delete({ id: 1 });
        await hook.waitFor(() => hook.result.current.delete.mutation.isSuccess);

        expect(anotherHook.result.current.data).toBeNull();
    });
});
