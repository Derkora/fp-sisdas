import { IonIcon, IonText } from '@ionic/react';

export function SensorCard({ label, value, icon }: { label: string; value: string, icon: any }) {
    return (
        <div className="bg-[#6EE5EA] rounded-lg py-3 px-4 flex items-center gap-4 w-full h-[72px]">
            <IonIcon icon={icon} />
            <div>
                <IonText className="block text-sm font-bold text-gray-800">{label}</IonText>
                <IonText className="block text-sm text-gray-900">{value}</IonText>
            </div>
        </div>
    );
}
