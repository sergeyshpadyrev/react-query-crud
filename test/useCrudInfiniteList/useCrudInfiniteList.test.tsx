import { defaultItems } from './api.mock';
import { describe, it, expect } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React, { useMemo } from 'react';
import { useItems } from './hook';

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCrudInfiniteList', () => {
  it('should initialize with an empty list', () => {
    const hook = renderHook(() => useItems(5), { wrapper });
    expect(hook.result.current.list).toEqual([]);
  });

  it('should return items after loading', async () => {
    const hook = renderHook(() => useItems(5), { wrapper });
    await waitFor(() => hook.result.current.listQuery.isFetched);

    expect(hook.result.current.list).toEqual(defaultItems.slice(0, 5));
  });

  it('should add items on create', async () => {
    const hook = renderHook(() => useItems(5), { wrapper });
    await waitFor(() => hook.result.current.listQuery.isSuccess);

    await hook.result.current.create({ name: 'Charlie' });
    await waitFor(() => hook.result.current.createMutation.isSuccess);
    expect(hook.result.current.list).toEqual([
      { id: 11, name: 'Charlie' },
      ...defaultItems.slice(0, 5),
    ]);
  });

  it('should remove items on delete', async () => {
    const hook = renderHook(() => useItems(5), { wrapper });
    await waitFor(() => hook.result.current.listQuery.isSuccess);

    await hook.result.current.delete({ id: 1 });
    await waitFor(() => hook.result.current.deleteMutation.isSuccess);
    expect(hook.result.current.list).toEqual(defaultItems.slice(1, 5));
  });

  // it('should change items on update', async () => {
  //   const hook = renderHook(() => useItems(5), { wrapper });
  //   await waitFor(() => hook.result.current.listQuery.isSuccess);

  //   await hook.result.current.update({ id: 2, data: { name: 'Charlie' } });
  //   await waitFor(() => hook.result.current.updateMutation.isSuccess);
  //   expect(hook.result.current.list).toEqual([
  //     defaultItems[0],
  //     { id: 2, name: 'Charlie' },
  //   ]);
  // });

  // it('should recreate item on custom hook', async () => {
  //   const hook = renderHook(() => useItems(5), { wrapper });
  //   await waitFor(() => hook.result.current.listQuery.isSuccess);

  //   await hook.result.current.recreate(1);
  //   await waitFor(() => hook.result.current.recreateMutation.isSuccess);
  //   expect(hook.result.current.list).toEqual([
  //     defaultItems[1],
  //     { id: 3, name: 'Alice' },
  //   ]);
  // });

  // it('should clear items on custom hook', async () => {
  //   const hook = renderHook(() => useItems(5), { wrapper });
  //   await waitFor(() => hook.result.current.listQuery.isSuccess);

  //   await hook.result.current.clear();
  //   await waitFor(() => hook.result.current.clearMutation.isSuccess);
  //   expect(hook.result.current.list).toEqual([]);
  // });
});
