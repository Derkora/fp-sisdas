import { IonText } from '@ionic/react';

export function AIResultCard({ result }: { result: string }) {
    return (
        <div className="bg-[#FFFDEB] rounded-lg px-6 py-5 border border-black w-full">
            <IonText className="block text-sm font-semibold text-gray-800 mb-2">Model : Fuzzy</IonText>
            <IonText className="block text-3xl font-bold text-gray-900 leading-tight text-center">
                Hasil Model AI <br />
                {result}
            </IonText>
        </div>
    );
}
