import { defaultItems } from './api.mock';
import { describe, it, expect } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useItems } from './hook';

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCrudList', () => {
  it('should initialize with an empty list', () => {
    const hook = renderHook(() => useItems('emptyList'), { wrapper });
    expect(hook.result.current.list).toEqual([]);
  });

  it('should return items after loading', async () => {
    const hook = renderHook(() => useItems('itemsAfterLoading'), { wrapper });
    await hook.waitFor(() => hook.result.current.listQuery.isSuccess);
    expect(hook.result.current.list).toEqual(defaultItems);
  });

  it('should add items on create', async () => {
    const hook = renderHook(() => useItems('onCreate'), { wrapper: wrapper });
    await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

    await hook.result.current.create({ name: 'Charlie' });
    await hook.waitFor(() => hook.result.current.createMutation.isSuccess);

    expect(hook.result.current.list).toEqual([
      ...defaultItems,
      { id: 3, name: 'Charlie' },
    ]);
  });

  it('should remove items on delete', async () => {
    const hook = renderHook(() => useItems('onDelete'), { wrapper });
    await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

    await hook.result.current.delete({ id: 2 });
    await hook.waitFor(() => hook.result.current.deleteMutation.isSuccess);
    expect(hook.result.current.list).toEqual([defaultItems[0]]);
  });

  it('should change items on update', async () => {
    const hook = renderHook(() => useItems('onUpdate'), { wrapper });
    await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

    await hook.result.current.update({ id: 2, data: { name: 'Charlie' } });
    await hook.waitFor(() => hook.result.current.updateMutation.isSuccess);
    expect(hook.result.current.list).toEqual([
      defaultItems[0],
      { id: 2, name: 'Charlie' },
    ]);
  });

  it('should recreate item on custom hook', async () => {
    const hook = renderHook(() => useItems('onRecreate'), { wrapper });
    await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

    await hook.result.current.recreate(1);
    await hook.waitFor(() => hook.result.current.recreateMutation.isSuccess);
    expect(hook.result.current.list).toEqual([
      defaultItems[1],
      { id: 3, name: 'Alice' },
    ]);
  });

  it('should clear items on custom hook', async () => {
    const hook = renderHook(() => useItems('onClear'), { wrapper });
    await hook.waitFor(() => hook.result.current.listQuery.isSuccess);

    await hook.result.current.clear();
    await hook.waitFor(() => hook.result.current.clearMutation.isSuccess);
    expect(hook.result.current.list).toEqual([]);
  });
});
