import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Menu } from '@/features/company/components/menu';
import { IonSplitPaneStyle } from './dashboard-layout.styled';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <IonRouterOutlet id="main"></IonRouterOutlet>
      <IonSplitPaneStyle contentId="main">
        <Menu />
        {children}
      </IonSplitPaneStyle>
    </>
  );
};
