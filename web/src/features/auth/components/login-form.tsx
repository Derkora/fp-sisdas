import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { useIonToast, useIonLoading, useIonRouter } from '@ionic/react';
import { LoginInput, LoginInputSchema, useLogin } from '@/lib/auth';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({ onSuccess });
  const [showLoading, hideLoading] = useIonLoading();
  const [presentToast] = useIonToast();
  const router = useIonRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (values: LoginInput) => {
    showLoading();
    try {
      await login.mutateAsync(values);
    } catch (err: any) {
      presentToast({
        message: err?.message || 'Login gagal, coba lagi!',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
    } finally {
      hideLoading();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Selamat Datang Di Attenda!</h2>
        <p className="text-gray-500 text-sm mt-1">
          Masuk atau Daftar sekarang! untuk menikmati semua fitur yang tersedia di Attenda.
        </p>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-700 font-medium block mb-1">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <input
                {...field}
                type="text"
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        />
        <ErrorMessage
          name="email"
          errors={errors}
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1">{message}</p>
          )}
        />
      </div>

      <div className="mb-6">
        <label className="text-sm text-gray-700 font-medium block mb-1">Password</label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="password"
              placeholder="Masukkan password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        <ErrorMessage
          name="password"
          errors={errors}
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1">{message}</p>
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
        LANJUTKAN
      </button>

      <div className="text-center mt-3">
        <p className="text-sm text-gray-500">
          Belum punya akun?{' '}
          <button onClick={() => router.push('/auth/registrasi')} className="text-blue-600 font-medium hover:underline">
            Daftar sekarang
          </button>
        </p>
      </div>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Mengalami Kendala?{' '}
          <a href="#" className="text-blue-600 font-medium hover:underline">
            Hubungi Kami
          </a>
        </p>
      </div>
    </form>
  );
};
