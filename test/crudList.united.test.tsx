import { defaultItems } from './crudList/api';
import { describe, it, expect } from '@jest/globals';
import { QueryClient } from '@tanstack/react-query';
import { QueryCrudClientProvider } from '../src';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItemsList } from './crudList/hook';

const defaultItemsWithTypenames = defaultItems.map((item) => ({ ...item, __typename: 'item' }));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryCrudClientProvider client={queryClient}>{children}</QueryCrudClientProvider>
);

describe('useCrudList wrapper', () => {
    it('should initialize with undefined', () => {
        const itemsAPI = renderHook(() => useItemsList('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });

        expect(items.result.current.query.data).toEqual(undefined);
        expect(items.result.current.value).toEqual([]);
    });

    it('should initialize with default items', async () => {
        const itemsAPI = renderHook(() => useItemsList('filledList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        expect(items.result.current.query.data).toEqual(defaultItemsWithTypenames);
    });

    it('should add items on create', async () => {
        const itemsAPI = renderHook(() => useItemsList('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.create({ name: 'Charlie' });
        await itemsAPI.waitFor(() => itemsAPI.result.current.create.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual([
            ...defaultItemsWithTypenames,
            { __typename: 'item', id: 3, name: 'Charlie' },
        ]);
    });

    it('should remove items on delete', async () => {
        const itemsAPI = renderHook(() => useItemsList('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.delete({ id: 2 });
        await itemsAPI.waitFor(() => itemsAPI.result.current.delete.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual([defaultItemsWithTypenames[0]]);
    });

    it('should change items on update', async () => {
        const itemsAPI = renderHook(() => useItemsList('emptyList'), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.update({ id: 2, name: 'Charlie' });
        await itemsAPI.waitFor(() => itemsAPI.result.current.update.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual([
            defaultItemsWithTypenames[0],
            { ...defaultItemsWithTypenames[1], name: 'Charlie' },
        ]);
    });
});
