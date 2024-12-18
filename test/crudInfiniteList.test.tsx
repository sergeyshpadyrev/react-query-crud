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

        expect(items.result.current.query.data).toEqual(undefined);
        expect(items.result.current.value).toEqual([]);
    });

    it('should initialize with default items', async () => {
        const itemsAPI = renderHook(() => useItems('filledInfiniteList', limit), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        expect(items.result.current.query.data).toEqual({
            pages: [{ canFetchMore: true, items: defaultItemsWithTypenames.slice(0, limit) }],
            pageParams: [0],
        });
        expect(items.result.current.value).toEqual(defaultItemsWithTypenames.slice(0, limit));
    });

    it('should add items on create', async () => {
        const itemsAPI = renderHook(() => useItems('filledInfiniteList', limit), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.create({ name: 'Xena' });
        await itemsAPI.waitFor(() => itemsAPI.result.current.create.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual({
            pages: [
                { canFetchMore: true, items: [{ __typename: 'item', id: 11, name: 'Xena' }] },
                { canFetchMore: true, items: defaultItemsWithTypenames.slice(0, limit) },
            ],
            pageParams: [0, 1],
        });
        expect(items.result.current.value).toEqual([
            { __typename: 'item', id: 11, name: 'Xena' },
            ...defaultItemsWithTypenames.slice(0, limit),
        ]);
    });

    it('should remove items on delete', async () => {
        const itemsAPI = renderHook(() => useItems('deleteList', limit), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.delete({ id: 1 });
        await itemsAPI.waitFor(() => itemsAPI.result.current.delete.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual({
            pages: [{ canFetchMore: true, items: defaultItemsWithTypenames.slice(1, limit) }],
            pageParams: [0],
        });
        expect(items.result.current.value).toEqual(defaultItemsWithTypenames.slice(1, limit));
    });

    it('should change items on update', async () => {
        const itemsAPI = renderHook(() => useItems('deleteList', limit), { wrapper });
        const items = renderHook(() => itemsAPI.result.current.read(), { wrapper });
        await items.waitFor(() => items.result.current.query.isSuccess);

        await itemsAPI.result.current.update({ id: 1, name: 'Xena' });
        await itemsAPI.waitFor(() => itemsAPI.result.current.update.mutation.isSuccess);
        items.rerender();

        expect(items.result.current.query.data).toEqual({
            pages: [
                {
                    canFetchMore: true,
                    items: [
                        { ...defaultItemsWithTypenames[0], name: 'Xena' },
                        ...defaultItemsWithTypenames.slice(1, limit),
                    ],
                },
            ],
            pageParams: [0],
        });
        expect(items.result.current.value).toEqual([
            { ...defaultItemsWithTypenames[0], name: 'Xena' },
            ...defaultItemsWithTypenames.slice(1, limit),
        ]);
    });
});
