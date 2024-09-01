import { defaultItem } from './api.mock';
import { describe, it, expect } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItem } from './hook';

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCrud', () => {
    it('should initialize with an empty value', () => {
        const hook = renderHook(() => useItem('empty'), { wrapper });
        expect(hook.result.current.data).toEqual(null);
    });

    it('should return item after loading', async () => {
        const hook = renderHook(() => useItem('itemAfterLoading'), { wrapper });
        await hook.waitFor(() => hook.result.current.dataQuery.isSuccess);
        expect(hook.result.current.data).toEqual(defaultItem);
    });

    it('should change item on update', async () => {
        const hook = renderHook(() => useItem('onUpdate'), { wrapper });
        await hook.waitFor(() => hook.result.current.dataQuery.isSuccess);

        await hook.result.current.update({ name: 'Bob' });
        await hook.waitFor(() => hook.result.current.update.mutation.isSuccess);
        expect(hook.result.current.data).toEqual({ name: 'Bob' });
    });

    it('should remove item on delete', async () => {
        const hook = renderHook(() => useItem('onDelete'), { wrapper });
        await hook.waitFor(() => hook.result.current.dataQuery.isSuccess);

        await hook.result.current.delete();
        await hook.waitFor(() => hook.result.current.delete.mutation.isSuccess);
        expect(hook.result.current.data).toEqual(null);
    });

    it('should add item on create', async () => {
        const hook = renderHook(() => useItem('onCreate'), { wrapper: wrapper });
        await hook.waitFor(() => hook.result.current.dataQuery.isSuccess);

        await hook.result.current.create({ name: 'Charlie' });
        await hook.waitFor(() => hook.result.current.create.mutation.isSuccess);

        expect(hook.result.current.data).toEqual({ name: 'Charlie' });
    });
});
