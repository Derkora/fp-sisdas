import { IonText } from '@ionic/react';

export function SensorCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[#6EE5EA] rounded-lg py-3 px-4 flex items-center gap-4 w-full h-[72px]">
            <div className="w-10 h-10 bg-[#FFFDEB] rounded-md shrink-0" />
            <div>
                <IonText className="block text-sm font-bold text-gray-800">{label}</IonText>
                <IonText className="block text-sm text-gray-900">{value}</IonText>
            </div>
        </div>
    );
}
