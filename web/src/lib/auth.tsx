// import { z } from 'zod';
// // import { supabase } from './supabase-client';
// // import { AuthError } from '@supabase/supabase-js';
// import { useLocation } from 'react-router';
// import { configureAuth } from 'react-query-auth';
// import { useEffect } from 'react';
// import { IonContent, IonSpinner, useIonRouter } from '@ionic/react';
// import { useQuery } from '@tanstack/react-query';

// export const LoginInputSchema = z.object({
// email: z.string().email('Invalid email'),
//   password: z.string(),
// });

// export type LoginInput = z.infer<typeof LoginInputSchema>;

// export const RegisterInputSchema = z.object({
//   username: z.string().min(1, 'Required'),
//   nrp: z.string().min(1, 'Required'),
//   email: z.string().email('Invalid email'),
//   password: z.string().min(1, 'Required'),
//   role: z.enum(['mahasiswa', 'dosen']),
// });

// export type RegisterInput = z.infer<typeof RegisterInputSchema>;

// const getUserWithProfile = async (authUserId: string) => {
//   const { data, error } = await supabase
//     .from('users')
//     .select('*')
//     .eq('auth_user_id', authUserId)
//     .single();

//   if (error) throw error;
//   return data;
// };

// export const logout = async (): Promise<{ error: AuthError | null }> => {
//   try {
//     await supabase.auth.signOut();
//     return { error: null };
//   } catch (error) {
//     throw error;
//   }
// };

// const authConfig = {
//   userFn: async () => {
//     try {
//       const { data: authData, error: authError } = await supabase.auth.getUser();

//       if (authError || !authData?.user) {
//         return { data: { user: null }, error: null };
//       }

//       const userProfile = await getUserWithProfile(authData.user.id);

//       return {
//         data: {
//           user: {
//             ...authData.user,
//             ...userProfile,
//           },
//         },
//         error: null,
//       };
//     } catch (error) {
//       return { data: { user: null }, error: null };
//     }
//   },

//   loginFn: async (data: LoginInput) => {
//     try {
//       const response = await supabase.auth.signInWithPassword(data);
//       const authUser = response.data.user;

//       if (!authUser) throw new Error('User not found after login');

//       const userProfile = await getUserWithProfile(authUser.id);

//       return {
//         data: {
//           user: {
//             ...authUser,
//             ...userProfile,
//           },
//         },
//         error: null,
//       };
//     } catch (error) {
//       throw error;
//     }
//   },

//   registerFn: async (credentials: RegisterInput) => {
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email: credentials.email.trim(),
//         password: credentials.password,
//       });

//       if (error) throw error;

//       if (data.user) {
//         const { error: insertError } = await supabase.from('users').insert([
//           {
//             auth_user_id: data.user.id,
//             username: credentials.username,
//             nrp: credentials.nrp,
//             email: credentials.email,
//             role: credentials.role,
//           },
//         ]);

//         if (insertError) throw insertError;
//       }

//       const userProfile = await getUserWithProfile(data!.user!.id);

//       return {
//         data: {
//           user: {
//             ...data.user,
//             ...userProfile,
//           },
//         },
//         error: null,
//       };
//     } catch (error) {
//       throw error;
//     }
//   },

//   logoutFn: logout,
// };

// export const {
//   useUser,
//   useLogin,
//   useLogout,
//   useRegister,
//   AuthLoader
// } = configureAuth(authConfig);

// export const useUserSession = () => {
//   return useQuery({
//     queryKey: ['authenticated-user-session'],
//     queryFn: async () => {
//       try {
//         const response = await supabase.auth.getSession();
//         return response;
//       } catch (error) {
//         throw error;
//       }
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const user = useUser();
//   const location = useLocation();
//   const router = useIonRouter();

//   useEffect(() => {
//     if (user.isFetched && !user.data?.data.user) {
//       router.push(`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`, 'root', 'replace');
//     }
//   }, [user.isFetched, user.data]);

//   if (!user.isFetched) {
//     return (
//       <IonContent>
//         <div className="w-full h-screen flex items-center justify-center">
//           <IonSpinner name="crescent" />
//         </div>
//       </IonContent>
//     );
//   }

//   return <>{user.data?.data.user ? children : null}</>;
// };

// export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
//   const user = useUser();
//   const router = useIonRouter();

//   useEffect(() => {
//     if (user.data?.data.user) {
//       router.push(`/app`, 'root', 'replace');
//     }
//   }, [user.data]);

//   return <>{user.data ? children : null}</>;
// };
