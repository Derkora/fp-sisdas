import { Fragment, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { IonMenuStyle, LogoWrapper, SubMenuItemLine } from './menu.styled';
import { useAppPages } from '../../api/get-app-pages';
import { caretDownOutline, caretUpOutline } from 'ionicons/icons';
// import { useLogout } from '@/lib/auth';

export const Menu: React.FC = () => {
  // const logout = useLogout();
  const router = useIonRouter();
  const location = useLocation();
  const appPages = useAppPages();
  const [hideNested, setHideNested] = useState<Record<string, boolean>>({});

  const toggleNestedMenu = (url: string) => {
    setHideNested((prevState) => ({
      ...prevState,
      [url]: !prevState[url],
    }));
  };

  return (
    <IonMenuStyle color="primary" contentId="main" type="overlay" style={{ position: 'relative', height: '100%' }}>
      <IonContent>
        <div className='bg-[#78E1E6] p-5 flex flex-col gap-4 items-center'>
          <IonText>
            Sistem Cerdas - Kelompok 9
          </IonText>
        </div>

        <IonList id="inbox-list">
          {appPages.map((appPage) => (
            <Fragment key={appPage.url}>
              <IonItem
                button
                className={location.pathname === appPage.url ? 'selected' : ''}
                onClick={() => router.push(appPage.url, 'none', 'replace')}
                lines="none"
              >
                <IonIcon slot="start" icon={appPage.icon} />
                <IonLabel className="ml-3">{appPage.title}</IonLabel>
                {appPage.children && appPage.children.length > 0 && (
                  <IonButton
                    sub-menu-toggle
                    slot="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNestedMenu(appPage.url);
                    }}
                  >
                    <IonIcon
                      icon={hideNested[appPage.url] ? caretUpOutline : caretDownOutline}
                      color="white"
                    />
                  </IonButton>
                )}
              </IonItem>

              {appPage.children &&
                !hideNested[appPage.url] &&
                appPage.children.map((childPage) => (
                  <IonItem
                    key={childPage.url}
                    sub-menu-item
                    button
                    className={location.pathname === childPage.url ? 'selected' : ''}
                    onClick={() => router.push(childPage.url, 'none', 'replace')}
                    lines="none"
                  >
                    <SubMenuItemLine slot="start" />
                    <IonIcon slot="start" icon={childPage.icon} />
                    <IonLabel>{childPage.title}</IonLabel>
                  </IonItem>
                ))}
            </Fragment>
          ))}
        </IonList>

      </IonContent>
      {/* <button
        style={{ padding: '12px 12px' }}
        onClick={() => logout.mutate({})}
        className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-md transition-all duration-300 w-full max-w-xs mx-auto mb-4 absolute bottom-0"
      >
        Keluar
      </button> */}
    </IonMenuStyle>
  );
};
