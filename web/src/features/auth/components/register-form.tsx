import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { RegisterInput, RegisterInputSchema, useRegister } from '@/lib/auth';
import { IonText, useIonLoading, useIonRouter } from '@ionic/react';

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const register = useRegister({ onSuccess });
    const [showLoading, hideLoading] = useIonLoading();
    const router = useIonRouter();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterInputSchema),
        reValidateMode: 'onSubmit',
    });

    const onSubmit = async (values: RegisterInput) => {
        showLoading();
        try {
            await register.mutateAsync(values);
        } finally {
            hideLoading();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-4">
            <div className="text-center mb-4">
                <IonText className="text-xl font-normal">Buat Akun Baru</IonText>
                <p className="text-sm text-gray-500">Silakan isi data untuk mendaftar.</p>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Jungkook"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                />
                <ErrorMessage
                    name="username"
                    errors={errors}
                    render={({ message }) => (
                        <p className="text-sm text-red-500 mt-1">{message}</p>
                    )}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">NRP / NIP</label>
                <Controller
                    name="nrp"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="number"
                            placeholder="00000"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                />
                <ErrorMessage
                    name="nrp"
                    errors={errors}
                    render={({ message }) => (
                        <p className="text-sm text-red-500 mt-1">{message}</p>
                    )}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="email"
                            placeholder="email@example.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                />
                <ErrorMessage
                    name="email"
                    errors={errors}
                    render={({ message }) => (
                        <p className="text-sm text-red-500 mt-1">{message}</p>
                    )}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="password"
                            placeholder="********"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                />
                <ErrorMessage
                    name="password"
                    errors={errors}
                    render={({ message }) => (
                        <p className="text-sm text-red-500 mt-1">{message}</p>
                    )}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Pilih Role</option>
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="dosen">Dosen</option>
                        </select>
                    )}
                />
                <ErrorMessage
                    name="role"
                    errors={errors}
                    render={({ message }) => (
                        <p className="text-sm text-red-500 mt-1">{message}</p>
                    )}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition"
                style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                }}
            >
                Register
            </button>
            <div className="text-center mt-3">
                <p className="text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <button onClick={() => router.push('/auth/login')} className="text-blue-600 font-medium hover:underline">
                        Masuk
                    </button>
                </p>
            </div>
        </form>
    );
};
