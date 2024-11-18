import { QueryClient } from '@tanstack/react-query';

export interface QueryCrudClientProviderProps {
    children: React.ReactNode;
    client: QueryClient;
}
