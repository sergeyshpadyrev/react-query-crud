import { describe, it, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCrudList } from '../src';
import React from 'react';

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const useItems = () =>
  useCrudList({
    crud: {
      create: jest.fn(),
      delete: jest.fn(),
      read: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
    },
    key: ['items'],
  });

describe('useCrudList', () => {
  it('should initialize with an empty list', () => {
    const { result } = renderHook(useItems, { wrapper });
    expect(result.current.list).toEqual([]);
  });
});
