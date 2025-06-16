import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { IonPage } from '@ionic/react'
import { SensorCard } from './components/SensorCard'
import { MQTTStatusCard } from './components/MQTTStatusCard'
import { AIResultCard } from './components/AIResultCard'
import { useEffect, useState } from 'react'
import useMQTT from '@/mqtt/useMqtt'

function fuzzyLogic(suhu: number, kelembapan: number): string {
    if (suhu > 35 && kelembapan < 40) return 'Panas Terik'
    if (suhu > 30 && kelembapan > 70) return 'Lembap Panas'
    if (suhu < 20 && kelembapan > 80) return 'Hujan Deras'
    if (suhu < 25 && kelembapan > 60) return 'Hujan Ringan'
    if (suhu >= 25 && suhu <= 30 && kelembapan >= 50 && kelembapan <= 70) return 'Cuaca Normal'
    return 'Tidak Terdeteksi'
}

export default function DashboardSisdas() {
    const [temperature, setTemperature] = useState<string>('...')
    const [kelembapan, setKelembapan] = useState<string>('...')
    const [mqttStatus, setMqttStatus] = useState<'connected' | 'disconnected'>('disconnected')
    const [fuzzyResult, setFuzzyResult] = useState<string>('Memproses...')

    const { publish } = useMQTT({
        onMessage: (topic, message) => {
            if (topic === 'esp32/sensor/suhu') {
                setTemperature(message + '°C')
            } else if (topic === 'esp32/sensor/kelembaban') {
                setKelembapan(message + 'H')
            }
        },
        onStatusChange: (status) => {
            console.log('MQTT Status Changed:', status)
            setMqttStatus(status)
        }
    })

    useEffect(() => {
        const suhu = parseInt(temperature)
        const lembap = parseInt(kelembapan)

        if (
            mqttStatus === 'connected' &&
            !isNaN(suhu) &&
            !isNaN(lembap)
        ) {
            const result = fuzzyLogic(suhu, lembap)
            setFuzzyResult(result)

            const timestamp = new Date().toISOString()

fetch('http://127.0.0.1:5000/log', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ result, timestamp })
})

            setTimeout(() => {
                console.log('Suhu:', suhu, 'Kelembapan:', lembap, 'Hasil Fuzzy:', result);
                publish('esp32/relay/control', suhu > 50 ? '1' : '0')
            }, 100)
        }
    }, [temperature, kelembapan, mqttStatus])

    return (
        <DashboardLayout>
            <IonPage id="main">
                <div className="bg-[#F1F5F9] min-h-screen w-full p-10 flex flex-col gap-6 items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <SensorCard label="Temperature" value={temperature} />
                        <SensorCard label="Kelembaban" value={kelembapan} />
                    </div>
                    <div className="w-full">
                        <MQTTStatusCard status={mqttStatus} host="192.168.213.78" port={9000} />
                    </div>

                    <div className="w-full">
                        <AIResultCard result={fuzzyResult} />
                    </div>
                </div>
            </IonPage>
        </DashboardLayout>
    )
}
