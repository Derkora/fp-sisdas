import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { IonPage } from '@ionic/react'
import { SensorCard } from './components/SensorCard'
import { MQTTStatusCard } from './components/MQTTStatusCard'
import { AIResultCard } from './components/AIResultCard'

export default function DashboardSisdas() {
    return (
        <DashboardLayout>
            <IonPage id="main">
                <div className="bg-[#F1F5F9] min-h-screen w-full p-10 flex flex-col gap-6 items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <SensorCard label="Temperature" value="60°C" />
                        <SensorCard label="Kelembaban" value="66 H" />
                        <SensorCard label="Cahaya" value="27 Lux" />
                        <SensorCard label="Jarak" value="166 cm" />
                    </div>

                    <div className="w-full">
                        <MQTTStatusCard />
                    </div>

                    <div className="w-full">
                        <AIResultCard result="Hujan Deras" />
                    </div>
                </div>
            </IonPage>
        </DashboardLayout>
    )
}
