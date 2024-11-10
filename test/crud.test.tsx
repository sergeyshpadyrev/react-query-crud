import { defaultItem } from './crud/api';
import { describe, it, expect } from '@jest/globals';
import { QueryClient } from '@tanstack/react-query';
import { QueryCrudClientProvider } from '../src';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItem } from './crud/hook';

const defaultItemWithTypename = { __typename: 'item', ...defaultItem };

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryCrudClientProvider client={queryClient}>{children}</QueryCrudClientProvider>
);

describe('useCrud', () => {
    it('should initialize with undefined', () => {
        const itemAPI = renderHook(() => useItem('empty'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        expect(item.result.current.data).toEqual(undefined);
    });

    it('should initialize with default item', async () => {
        const itemAPI = renderHook(() => useItem('filled'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        await item.waitFor(() => item.result.current.isSuccess);
        expect(item.result.current.data).toEqual(defaultItemWithTypename);
    });

    it('should change item on update', async () => {
        const itemAPI = renderHook(() => useItem('filled'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        await item.waitFor(() => item.result.current.isSuccess);

        await itemAPI.result.current.update.mutateAsync({ id: 1, name: 'Bob' });
        await itemAPI.waitFor(() => itemAPI.result.current.update.isSuccess);
        item.rerender();

        expect(item.result.current.data).toEqual({ __typename: 'item', id: 1, name: 'Bob' });
    });

    it('should remove item on delete', async () => {
        const itemAPI = renderHook(() => useItem('filled'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        await item.waitFor(() => item.result.current.isSuccess);

        await itemAPI.result.current.delete.mutateAsync(undefined);
        await itemAPI.waitFor(() => itemAPI.result.current.delete.isSuccess);
        item.rerender();

        expect(item.result.current.data).toBeNull();
    });

    it('should add item on create', async () => {
        const itemAPI = renderHook(() => useItem('filled'), { wrapper });
        const item = renderHook(() => itemAPI.result.current.read(), { wrapper });
        await item.waitFor(() => item.result.current.isSuccess);

        await itemAPI.result.current.create.mutateAsync({ name: 'Bob' });
        await itemAPI.waitFor(() => itemAPI.result.current.create.isSuccess);
        item.rerender();

        expect(item.result.current.data).toEqual({ __typename: 'item', id: 2, name: 'Bob' });
    });
});
