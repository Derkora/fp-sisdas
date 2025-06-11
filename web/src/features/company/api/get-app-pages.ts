import { AppPage } from '@/types/api';
import {
  cameraOutline,
  homeOutline,
  mapOutline,
  people,
  personOutline,
  schoolOutline,
  timeOutline,
  warningOutline,
  diamondSharp
} from 'ionicons/icons';
import DashboardSisdas from '@/pages/sisdas/DashboardSisdas';
import DashboardAlat from '@/pages/sisdas/DashboardAlat';

export const useAppPages = () => {
  const appPages: AppPage[] = [
    { title: 'Dashboard IoT', url: '/dashboard-iot', icon: diamondSharp, page: DashboardSisdas },
    // { title: 'Data Alat', url: '/data-alat', icon: personOutline, page: DashboardAlat },
  ];

  return appPages;
};
