import { QueryClientProvider, QueryClientProviderProps } from '@tanstack/react-query';
import { QueryNormalizerProvider } from '@normy/react-query';
import React from 'react';

const getNormalizationObjectKey = (data: any) =>
    !!data.id && !!data.__typename ? `${data.__typename}-${data.id}` : undefined;

export const QueryCrudClientProvider = (props: QueryClientProviderProps) => (
    <QueryNormalizerProvider normalizerConfig={{ getNormalizationObjectKey }} queryClient={props.client}>
        <QueryClientProvider client={props.client}>{props.children}</QueryClientProvider>
    </QueryNormalizerProvider>
);
