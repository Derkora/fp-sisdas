import { IonText } from '@ionic/react'

interface Props {
    status: string
    host: string
    port: number
}

export function MQTTStatusCard({ status, host, port }: Props) {
    return (
        <div className="bg-[#6EE5EA] rounded-lg p-5 w-full">
            <IonText className="block font-bold text-gray-800 mb-2">Status Koneksi MQTT</IonText>
            <IonText className="block text-sm text-gray-700">
                Koneksi ke Broker MQTT - Alamat: {host}:{port}
            </IonText>
            <IonText className={`block text-sm ${status === 'connected' ? 'text-green-700' : 'text-red-700'}`}>
                Koneksi ke Broker MQTT - {status.toUpperCase()}
            </IonText>
        </div>
    )
}
