import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { THead, TR } from './table.styled';
import { SetStateAction } from 'react';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { caretDown, caretUp, swapVertical } from 'ionicons/icons';

type Props<T extends Record<string, any>> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  pagination?: PaginationState;
  setPagination?: (updater: SetStateAction<PaginationState>) => void;
  sorting?: SortingState;
  setSorting?: (updater: SetStateAction<SortingState>) => void;
  rowCount?: number;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  showHeader?: boolean;
  nameContent?: Array<string>;
  extraContent?: React.ReactNode | Record<string, React.ReactNode>;
  onRowClicked?: (row: Row<T>) => void;
  onRowHovered?: (row: Row<T>) => void;
  isLoading?: boolean;
};

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  setPagination,
  sorting,
  setSorting,
  rowCount,
  headerStyle,
  cellStyle,
  showHeader = true,
  nameContent,
  extraContent,
  onRowClicked,
  onRowHovered,
  isLoading,
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: `${columns.length * 150}px` }}>
          {showHeader && (
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const renderNameHeader = flexRender(header.column.columnDef.header, header.getContext());
                    const nameHeader = header.column.id;
                    return (
                      <th key={header.id} style={{ ...headerStyle }}>
                        <IonRow style={{ display: 'flex', alignItems: 'center', width: '200px', justifyContent: 'space-between', paddingLeft: '8px', paddingRight: '8px' }}
                          {...(header.column.getCanSort() ? { onClick: header.column.getToggleSortingHandler() } : {})}
                        >
                          <IonRow
                            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                          >
                            {renderNameHeader}
                            {header.column.getIsSorted() === 'asc' ? (
                              <IonIcon icon={caretUp} />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <IonIcon icon={caretDown} />
                            ) : header.column.getCanSort() ? (
                              <IonIcon icon={swapVertical} />
                            ) : null}
                          </IonRow>
                          {nameHeader && nameContent?.includes(nameHeader) && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* @ts-expect-error - hmm */}
                              {extraContent?.[nameHeader]}
                            </div>
                          )}
                        </IonRow>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </THead>
          )}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={table.getAllColumns().length}
                  style={{ textAlign: 'center', padding: '16px' }}>
                  <IonSpinner name="dots" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length}
                  style={{ textAlign: 'center', padding: '10px' }}>
                  Tidak ada data tersedia
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TR
                  key={row.id}
                  onClick={() => onRowClicked?.(row)}
                  onMouseEnter={() => onRowHovered?.(row)}
                  // @ts-expect-error - hmm
                  onMouseLeave={() => onRowHovered?.(null)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td style={{ width: cell.column.getSize(), paddingLeft: '10px', paddingRight: '10px', ...cellStyle }} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </TR>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <IonRow>
                <IonButton
                  fill="clear"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<<'}
                </IonButton>
                <IonButton
                  fill="clear"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<'}
                </IonButton>
                <IonButton
                  fill="clear"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>'}
                </IonButton>
                <IonButton
                  fill="clear"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>>'}
                </IonButton>
              </IonRow>

              <IonRow style={{ display: 'flex', alignItems: 'center' }}>
                <IonRow style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonText>Pergi ke halaman:</IonText>
                  <IonInput
                    style={{
                      width: '60px',
                      borderRadius: '4px',
                      textAlign: 'center',
                    }}
                    type="number"
                    value={table.getState().pagination.pageIndex + 1}
                    min="1"
                    max={table.getPageCount()}
                    onIonChange={(e) => {
                      let page = e.target.value ? Number(e.target.value) - 1 : 0;
                      if (page >= table.getPageCount()) {
                        page = table.getPageCount() - 1;
                      }
                      table.setPageIndex(page);
                    }}
                  />
                </IonRow>
              </IonRow>
            </div>

            <div className="pagination-info">
              <IonText>
                Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
                {table.getPageCount().toLocaleString()}
              </IonText>
            </div>

            <div className="select-group">
              <IonSelect
                interface="popover"
                value={table.getState().pagination.pageSize}
                onIonChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 25, 50, 100, 200].map((pageSize) => (
                  <IonSelectOption key={pageSize} value={pageSize}>
                    {pageSize} Jumlah baris
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
          </div>

          <IonText>
            Mengambil {table.getRowModel().rows.length.toLocaleString()} dari{' '}
            {rowCount?.toLocaleString()} Jumlah baris
          </IonText>
        </>
      ) : null}
    </>
  );
}
