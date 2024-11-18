import { QueryClientProvider } from '@tanstack/react-query';
import { QueryCrudClientProviderProps } from './types';
import { QueryNormalizerProvider } from '@normy/react-query';
import React from 'react';

const getNormalizationObjectKey = (data: any) =>
    !!data.id && !!data.__typename ? `${data.__typename}-${data.id}` : undefined;

export const QueryCrudClientProvider = (props: QueryCrudClientProviderProps) => (
    <QueryNormalizerProvider normalizerConfig={{ getNormalizationObjectKey }} queryClient={props.client}>
        <QueryClientProvider client={props.client}>{props.children}</QueryClientProvider>
    </QueryNormalizerProvider>
);
