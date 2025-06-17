import { AppPage } from '@/types/api'
import {
  diamondSharp,
  appsOutline
} from 'ionicons/icons';
import DashboardSisdas from '@/pages/sisdas/DashboardSisdas';
import DashboardFromSupabase from '@/pages/sisdas/DashboardFromSupabase';

export const useAppPages = () => {
  const appPages: AppPage[] = [
    { title: 'Dashboard IoT', url: '/dashboard-iot', icon: diamondSharp, page: DashboardSisdas },
    { title: 'Database', url: '/from-database', icon: appsOutline, page: DashboardFromSupabase },
  ];

  return appPages;
};
