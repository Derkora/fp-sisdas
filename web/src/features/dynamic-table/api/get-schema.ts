import { queryOptions, useQuery } from '@tanstack/react-query';
import { QueryConfig } from '@/lib/react-query';
import { supabase } from '@/lib/supabase-client';

export const getSchema = ({ tableParentName }: { tableParentName: string }): Promise<any> => {
  //@ts-ignore
  return supabase
    .schema('public')
    .from(tableParentName)
    .select('*')
    .order('created_at', { ascending: false })
    .throwOnError();
};

export const getSchemaQueryOptions = (tableParentName: string) => {
  return queryOptions({
    queryKey: ['schema', tableParentName],
    queryFn: () => getSchema({ tableParentName }),
  });
};

type UseSchemaOptions = {
  tableParentName: string;
  queryConfig?: QueryConfig<typeof getSchemaQueryOptions>;
};

export const useSchema = ({ tableParentName, queryConfig }: UseSchemaOptions) => {
  return useQuery({
    ...getSchemaQueryOptions(tableParentName),
    ...queryConfig,
  });
};
