import React, { useEffect } from 'react';
import {
    IonCard,
    IonCardContent,
    IonContent,
    IonPage,
    useIonRouter,
} from '@ionic/react';
import { useLocation } from 'react-router';
import { useUser } from '@/lib/auth';
import { RegisterForm } from '@/features/auth/components/register-form';

export default function Registrasi() {
    const user = useUser();
    const router = useIonRouter();
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirectTo = searchParams.get('redirectTo');

    useEffect(() => {
        if (user.data?.data.user) {
            router.push(`/app`, 'root', 'replace');
        }
    }, []);

    return (
        <IonPage>
            <IonContent fullscreen className="relative">
                <div className="absolute top-0 left-0 w-full h-[110vh]">
                    <img
                        src="/images/bege.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-10" />

                <div className="relative z-20 flex justify-center items-center h-full px-4">
                    <IonCard className="w-full max-w-md rounded-2xl shadow-lg">
                        <IonCardContent className="p-6">
                            <RegisterForm
                                onSuccess={() => {
                                    router.push(`${redirectTo ? `${redirectTo}` : '/'}`);
                                }}
                            />
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};
