import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import Table from '@/components/ui/table/table'

import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'
import { IonContent, IonPage } from '@ionic/react'

type Log = {
    id: number
    created_at: string
    temperature: number
    kelembapan: number
    relay_value: number
    label: string
}

export default function DashboardFromSupabase() {
    const [data, setData] = useState<Log[]>([])
    const [rowCount, setRowCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'created_at', desc: true }
    ])

    const columns = useMemo<ColumnDef<Log, any>[]>(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Tanggal',
                cell: ({ getValue }) =>
                    new Date(getValue<string>()).toLocaleString('id-ID', {
                        hour12: false, year: '2-digit', month: 'short', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    }),
                size: 160,
            },
            {
                accessorKey: 'temperature',
                header: 'Suhu (°C)',
                cell: ({ getValue }) => getValue<number>(),
                size: 80,
            },
            {
                accessorKey: 'kelembapan',
                header: 'Kelembapan (%)',
                cell: ({ getValue }) => getValue<number>(),
                size: 80,
            },
            {
                accessorKey: 'relay_value',
                header: 'Relay',
                cell: ({ getValue }) => (
                    <span className={getValue() === 1 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {getValue() === 1 ? 'ON' : 'OFF'}
                    </span>
                ),
                size: 60,
            },
            {
                accessorKey: 'label',
                header: 'Kondisi',
                cell: ({ getValue }) => getValue<string>(),
                size: 110,
            },
        ],
        []
    )

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            setError(null)
            const from = pagination.pageIndex * pagination.pageSize
            const to = from + pagination.pageSize - 1

            const sort = sorting[0] || { id: 'created_at', desc: true }
            const orderBy = sort.id
            const ascending = !sort.desc

            let query = supabase
                .from('sensor_logs')
                .select('*', { count: 'exact' })
                .order(orderBy, { ascending })

            query = query.range(from, to)

            const { data: rows, error, count } = await query
            if (error) {
                setError(error.message)
                setIsLoading(false)
                return
            }
            setData(rows as Log[])
            setRowCount(count ?? 0)
            setIsLoading(false)
        }
        fetchData()
    }, [pagination, sorting])

    return (
        <DashboardLayout>
            <IonPage id='main' className='h-full overflow-y-scroll'>
                <IonContent>
                    <div className="w-full p-4">
                        <h1 className="text-xl font-semibold mb-4">Riwayat Data Sensor</h1>
                        <Table<Log>
                            data={data}
                            columns={columns}
                            pagination={pagination}
                            setPagination={setPagination}
                            sorting={sorting}
                            setSorting={setSorting}
                            rowCount={rowCount}
                            isLoading={isLoading}
                        />
                        {error && (
                            <div className="text-red-500 text-sm mt-3">Gagal mengambil data: {error}</div>
                        )}
                    </div>
                </IonContent>
            </IonPage>
        </DashboardLayout>
    )
}
