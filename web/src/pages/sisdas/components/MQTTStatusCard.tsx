import { IonText } from '@ionic/react';

export function MQTTStatusCard() {
    return (
        <div className="bg-[#6EE5EA] rounded-lg p-5 w-full">
            <IonText className="block font-bold text-gray-800 mb-2">Status Koneksi MQTT</IonText>
            <IonText className="block text-sm text-gray-700">
                Koneksi ke Broker MQTT - Alamat: xxx.xxx.x.xxx:xxxx
            </IonText>
            <IonText className="block text-sm text-gray-700">Koneksi ke Broker MQTT - SUKSES</IonText>
        </div>
    );
}
