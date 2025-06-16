// import { queryOptions, useQuery } from '@tanstack/react-query';
// import { QueryConfig } from '@/lib/react-query';
// // import { supabase } from '@/lib/supabase-client';
// import { PaginationState } from '@tanstack/react-table';

// export const DEFAULT_PAGE_INDEX = 0;
// export const DEFAULT_PAGE_SIZE = 10;

// export const getTable = async ({
//   tableName,
//   pagination: { pageIndex, pageSize },
//   searchQuery,
// }: {
//   tableName: string;
//   pagination: PaginationState;
//   searchQuery?: string;
// }): Promise<{ data: any[]; count: number | null }> => {
//   const from = pageIndex * pageSize;
//   const to = from + pageSize - 1;

//   // let query = supabase
//   //   .from(tableName)
//   //   .select('*', { count: 'exact' })
//   //   .range(from, to);

//   // if (searchQuery) {
//   //   query = query.ilike('name', `%${searchQuery}%`);
//   // }

//   // const { data, error, count } = await query;

//   if (error) throw error;

//   const safeData = Array.isArray(data) ? data : data ? [data] : [];
//   return { data: safeData, count };
// };

// export const getTableQueryOptions = ({
//   tableName,
//   pagination,
//   searchQuery,
// }: {
//   tableName: string;
//   pagination: PaginationState;
//   searchQuery?: string;
// }) => {
//   return queryOptions({
//     queryKey: ['table', tableName, pagination, searchQuery],
//     queryFn: () => getTable({ tableName, pagination, searchQuery }),
//   });
// };

// type UseTableOptions = {
//   tableName: string;
//   pagination: PaginationState;
//   searchQuery?: string;
//   // @ts-expect-error - hmm
//   queryConfig?: QueryConfig<ReturnType<typeof getTable>>;
// };

// export const useTable = ({ tableName, pagination, searchQuery, queryConfig }: UseTableOptions) => {
//   return useQuery({
//     ...getTableQueryOptions({ tableName, pagination, searchQuery }),
//     ...queryConfig,
//   });
// };

