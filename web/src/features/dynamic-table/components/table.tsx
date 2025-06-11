import { useState } from 'react';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, useTable } from '../api/get-table';
import { IonSearchbar, IonSpinner } from '@ionic/react';
import { useSchema } from '../api/get-schema';
import Table from '@/components/ui/table/table';
import { createColumnHelper, PaginationState } from '@tanstack/react-table';

type DynamicTableProps = {
  tableParentName: string;
};

export const DynamicTable: React.FC<DynamicTableProps> = ({ tableParentName }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const schema = useSchema({ tableParentName });

  const table = useTable({
    tableName: tableParentName,
    pagination,
    searchQuery,
    queryConfig: { enabled: !!schema.data?.data },
  });

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('id', {
      header: () => <span>ID</span>,
    }),
    columnHelper.accessor('name', {
      header: () => <span>Name</span>,
    }),
    columnHelper.accessor('nrp', {
      header: () => <span>NRP</span>,
    }),

  ];

  if (table.isLoading)
    return (
      <div className="ion-padding" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IonSpinner name="dots"></IonSpinner>
      </div>
    );

  if (!table.data?.data) return null;

  return (
    <div className="ion-padding" style={{ position: 'relative' }}>
      <IonSearchbar
        value={searchQuery}
        onIonInput={(e) => {
          setSearchQuery(e.detail.value!);
          setPagination({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
        }}
        debounce={300}
        placeholder="Cari data..."
      />
      <Table
        pagination={pagination}
        setPagination={setPagination}
        data={table.data.data}
        // @ts-expect-error - hmm
        rowCount={table.data.count}
        // @ts-expect-error - hmm
        columns={columns}
      />
    </div>
  );
};
