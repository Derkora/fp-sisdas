import { QueryKey } from '@tanstack/react-query';

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ilike';

export type Filter = {
    field: string;
    value?: string;
    getCellValue?: boolean;
    getGroupId?: boolean;
    operator: FilterOperator;
};

export type ExternalFetchConfig = {
    filters: Filter[];
    queryKey: QueryKey;
    table: string;
    schema: string;
    selectQuery?: string;
};
