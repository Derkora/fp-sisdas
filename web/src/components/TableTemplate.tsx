import {
  IonContent,
  IonPage,
} from '@ionic/react';
import { AppPage } from '@/types/api';
import { DynamicTable } from '@/features/dynamic-table/components/table';
// import { ProtectedRoute } from '@/lib/auth';

export const TableTemplate: React.FC<AppPage> = ({ title, url, icon, tableParentName }) => {
  return (
    // <ProtectedRoute>
    <IonPage id="main">
      <IonContent fullscreen scrollY>
        {
          tableParentName &&
          <DynamicTable
            tableParentName={tableParentName}
          />
        }
      </IonContent>
    </IonPage>
    // </ProtectedRoute>
  );
};
