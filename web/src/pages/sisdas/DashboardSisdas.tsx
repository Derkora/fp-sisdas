import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { IonPage } from '@ionic/react'
import { SensorCard } from './components/SensorCard'
import { MQTTStatusCard } from './components/MQTTStatusCard'
import { AIResultCard } from './components/AIResultCard'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import useMQTT from '@/mqtt/useMqtt'
import { eyedropOutline, thermometerOutline } from 'ionicons/icons';

const labelMap = {
    "Panas Terik": "Cuaca sangat panas & kering",
    "Lembap Panas": "Panas lembap (sumuk)",
    "Hujan Deras": "Hujan deras/dingin",
    "Hujan Ringan": "Gerimis/rintik-rintik",
    "Cuaca Normal": "Normal/sejuk",
    "Dingin Kering": "Dingin dan kering",
    "Normal Kering": "Cenderung normal & agak kering",
    "Normal Basah": "Agak lembap (normal)",
    "Panas Basah": "Panas dan sangat lembap"
}

function suhuMembership(suhu: number) {
    return {
        dingin: suhu <= 22 ? 1 : suhu < 27 ? (27 - suhu) / 5 : 0,
        normal: suhu >= 22 && suhu <= 32 ? (1 - Math.abs(suhu - 27) / 5) : 0,
        panas: suhu >= 30 ? (suhu < 37 ? (suhu - 30) / 7 : 1) : 0,
    };
}
function kelembapanMembership(kelembapan: number) {
    return {
        kering: kelembapan <= 40 ? 1 : kelembapan < 55 ? (55 - kelembapan) / 15 : 0,
        lembap: kelembapan >= 40 && kelembapan <= 80 ? (1 - Math.abs(kelembapan - 60) / 20) : 0,
        basah: kelembapan >= 75 ? (kelembapan < 90 ? (kelembapan - 75) / 15 : 1) : 0,
    };
}
function fuzzyRelay(suhu: number, kelembapan: number) {
    const s = suhuMembership(suhu);
    const k = kelembapanMembership(kelembapan);

    const rules = [
        { suhu: 'dingin', kelembapan: 'kering', output: 0 },
        { suhu: 'dingin', kelembapan: 'lembap', output: 0 },
        { suhu: 'dingin', kelembapan: 'basah', output: 1 },
        { suhu: 'normal', kelembapan: 'kering', output: 0 },
        { suhu: 'normal', kelembapan: 'lembap', output: 1 },
        { suhu: 'normal', kelembapan: 'basah', output: 1 },
        { suhu: 'panas', kelembapan: 'kering', output: 1 },
        { suhu: 'panas', kelembapan: 'lembap', output: 1 },
        { suhu: 'panas', kelembapan: 'basah', output: 1 },
    ];

    let maxAlpha = 0;
    let relay = 0;
    for (let rule of rules) {
        // @ts-expect-error - hmm
        const hs = s[rule.suhu];
        // @ts-expect-error - hmm
        const hk = k[rule.kelembapan];
        const a = Math.min(hs, hk);
        if (a > maxAlpha) {
            maxAlpha = a;
            relay = rule.output;
        }
    }
    return relay;
}

async function logToSupabase({ temperature, kelembapan, relay_value, label }: {
    temperature: number
    kelembapan: number
    relay_value: number
    label: string
}) {
    const { error } = await supabase.from('sensor_logs').insert([{
        temperature,
        kelembapan,
        relay_value,
        label,
        // @ts-expect-error - hmm
        label_description: labelMap[label] || label
    }])
    if (error) {
        console.error('Supabase log error:', error)
    } else {
        console.log('Log berhasil ke Supabase')
    }
}

function fuzzyLabel(suhu: number, kelembapan: number) {
    const s = suhuMembership(suhu);
    const k = kelembapanMembership(kelembapan);

    const labelCandidates = [
        { label: 'Panas Terik', value: Math.min(s.panas, k.kering) },
        { label: 'Lembap Panas', value: Math.min(s.panas, k.lembap) },
        { label: 'Hujan Deras', value: Math.min(s.dingin, k.basah) },
        { label: 'Hujan Ringan', value: Math.min(s.dingin, k.lembap) },
        { label: 'Cuaca Normal', value: Math.min(s.normal, k.lembap) },
        { label: 'Dingin Kering', value: Math.min(s.dingin, k.kering) },
        { label: 'Normal Kering', value: Math.min(s.normal, k.kering) },
        { label: 'Normal Basah', value: Math.min(s.normal, k.basah) },
        { label: 'Panas Basah', value: Math.min(s.panas, k.basah) }
    ];

    const max = labelCandidates.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));
    return max.value > 0 ? max.label : 'Kondisi Tidak Terdefinisi';
}

export default function DashboardSisdas() {
    const [temperature, setTemperature] = useState('...')
    const [kelembapan, setKelembapan] = useState('...')
    const [mqttStatus, setMqttStatus] = useState('disconnected')
    const [fuzzyResult, setFuzzyResult] = useState('Memproses...')
    const [lastRelay, setLastRelay] = useState(0)

    const { publishWithRetry } = useMQTT({
        onMessage: (topic, message) => {
            if (topic === 'esp32/sensor/suhu') {
                setTemperature(message)
            } else if (topic === 'esp32/sensor/kelembaban') {
                setKelembapan(message)
            }
        },
        onStatusChange: (status) => {
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
            const relayValue = fuzzyRelay(suhu, lembap);
            const resultLabel = fuzzyLabel(suhu, lembap);
            setFuzzyResult(resultLabel);

            if (relayValue !== lastRelay) {
                publishWithRetry('esp32/relay/control', String(relayValue))
                setLastRelay(relayValue);
                // logToSupabase({
                //     temperature: suhu,
                //     kelembapan: lembap,
                //     relay_value: relayValue,
                //     label: resultLabel
                // });
            }
        }
    }, [temperature, kelembapan, mqttStatus, lastRelay])

    const suhuVal = isNaN(parseInt(temperature)) ? 0 : parseInt(temperature)
    const kelembapanVal = isNaN(parseInt(kelembapan)) ? 0 : parseInt(kelembapan)
    const suhuM = suhuMembership(suhuVal)
    const kelembapanM = kelembapanMembership(kelembapanVal)
    const relayValue = fuzzyRelay(suhuVal, kelembapanVal)

    const highestSuhu = Object.entries(suhuM).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    const highestKelembapan = Object.entries(kelembapanM).reduce((a, b) => a[1] > b[1] ? a : b)[0]

    return (
        <DashboardLayout>
            <IonPage id='main' className='h-full overflow-y-scroll'>
                <div className="bg-[#F1F5F9] h-full w-full p-6 flex flex-col gap-5 items-center">
                    <div className="grid grid-cols-2 gap-4 w-full ">
                        <SensorCard label="Temperature" value={temperature + "°C"} icon={thermometerOutline} />
                        <SensorCard label="Kelembaban" value={kelembapan + "%"} icon={eyedropOutline} />
                    </div>
                    {/* @ts-expect-error - hmm */}
                    <MQTTStatusCard status={mqttStatus} host="" port={port} />
                    <AIResultCard result={fuzzyResult} />

                    <div className="w-full rounded-lg px-4 py-2 bg-white shadow-sm text-xs text-gray-600 flex flex-wrap gap-x-6 gap-y-2 justify-between">
                        <div>
                            <b>Suhu:</b>
                            <span className="ml-1 text-sky-700">≤22° dingin</span>,
                            <span className="ml-1 text-emerald-700">22-32° normal</span>,
                            <span className="ml-1 text-orange-700">≥30° panas</span>
                        </div>
                        <div>
                            <b>Kelembapan:</b>
                            <span className="ml-1 text-yellow-700">≤40% kering</span>,
                            <span className="ml-1 text-cyan-700">40-80% lembap</span>,
                            <span className="ml-1 text-blue-700">≥75% basah</span>
                        </div>
                    </div>

                    <div className="mt-4 w-full rounded-lg bg-white shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                            <span className="text-[#6366f1]">Fuzzy Logic</span>
                            <span className={relayValue === 1 ? 'text-green-600' : 'text-red-600'}>({relayValue === 1 ? 'Relay ON' : 'Relay OFF'})</span>
                        </div>
                        <table className="w-full text-xs text-center border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="text-gray-500 bg-gray-100">
                                    <th className="border border-gray-300"></th>
                                    <th className="px-2 border border-gray-300">Dingin/Kering</th>
                                    <th className="px-2 border border-gray-300">Normal/Lembap</th>
                                    <th className="px-2 border border-gray-300">Panas/Basah</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="font-medium text-gray-600 border border-gray-300">Suhu</td>
                                    <td className='text-black border border-gray-300'>{suhuM.dingin.toFixed(2)}</td>
                                    <td className='text-black border border-gray-300'>{suhuM.normal.toFixed(2)}</td>
                                    <td className='text-black border border-gray-300'>{suhuM.panas.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium text-gray-600 border border-gray-300">Kelembapan</td>
                                    <td className='text-black border border-gray-300'>{kelembapanM.kering.toFixed(2)}</td>
                                    <td className='text-black border border-gray-300'>{kelembapanM.lembap.toFixed(2)}</td>
                                    <td className='text-black border border-gray-300'>{kelembapanM.basah.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
                            <div>
                                <span className="font-semibold text-gray-700">Kondisi:</span>
                                <span className="ml-1">{fuzzyResult}</span>
                                {/* @ts-expect-error - hmm */}
                                <span className="ml-2 text-gray-400">({labelMap[fuzzyResult]})</span>
                            </div>
                            <div>
                                <span>Membership terbesar: </span>
                                <span className="font-semibold text-indigo-600">{highestSuhu}</span> (suhu),
                                <span className="font-semibold text-indigo-600 ml-1">{highestKelembapan}</span> (kelembapan)
                            </div>
                        </div>
                    </div>
                </div>
            </IonPage>
        </DashboardLayout>
    )
}