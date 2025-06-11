import { IonApp, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { AuthLoader, ProtectedRoute } from './lib/auth';
import { TableTemplate } from './components/TableTemplate';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css' */
/* import '@ionic/react/css/palettes/dark.class.css' */
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './global.css';
import { createGlobalStyle } from 'styled-components';
import { useAppPages } from './features/company/api/get-app-pages';
// import { useAuthorization } from './lib/authorization';
import React, { useEffect, useState } from 'react';
// import LoadingPage from './features/loading/LoadingPage';
import { Capacitor } from '@capacitor/core';
import { Suspense } from 'react';
const Registrasi = React.lazy(() => import('./pages/auth/Registrasi'));

setupIonicReact();

const GlobalStyle = createGlobalStyle`
:root {
	--ion-color-primary: #e12330;
	--ion-color-primary-rgb: 225,35,48;
	--ion-color-primary-contrast: #ffffff;
	--ion-color-primary-contrast-rgb: 255,255,255;
	--ion-color-primary-shade: #c61f2a;
	--ion-color-primary-tint: #e43945;

	--ion-color-secondary: #16BFD6;
	--ion-color-secondary-rgb: 22,191,214;
	--ion-color-secondary-contrast: #000000;
	--ion-color-secondary-contrast-rgb: 0,0,0;
	--ion-color-secondary-shade: #13a8bc;
	--ion-color-secondary-tint: #2dc5da;
}
`;

const App: React.FC = () => {
  const appPages = useAppPages();
  // const { role } = useAuthorization();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const isNative = Capacitor.isNativePlatform()
  if (isNative) {
  }

  useEffect(() => {
    if (isNative) {
      const timer = setTimeout(() => {
        setIsAppLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsAppLoading(false);
    }
  }, [isNative]);

  const flattenedRoutes = appPages.flatMap((page) => [page, ...(page.children || [])]);

  return (
    <Suspense fallback={
      <IonApp>
        <div style={{
          backgroundColor: '#fff',
          width: '100%',
          height: '100%',
        }}>
          <></>
        </div>
      </IonApp>
    }>
      <GlobalStyle />
      <IonApp>
        <IonReactRouter>
          <AuthLoader
            renderLoading={() => (isNative ? <></> : <IonSpinner />)}
          >
            {/* <Route
              path="/"
              exact={true}
              render={() => {
                return role ? <Redirect to="/app" /> : <Redirect to="/auth/login" />;
              }}
            /> */}
            <Route path="/auth/login" exact>
              <Login />
            </Route>
            <Route path="/auth/registrasi" exact>
              <Registrasi />
            </Route>

            <ProtectedRoute>
              {flattenedRoutes.map((route) => {
                return (
                  <Route key={route.url} path={route.url} exact>
                    {route.page ? <route.page {...route} /> : <TableTemplate {...route} />}
                  </Route>
                )
              })}
            </ProtectedRoute>

            {/* <Route path="*">
              <Redirect to="/app" />
            </Route> */}
          </AuthLoader>
        </IonReactRouter>
      </IonApp>
    </Suspense>
  );
};


export default App;
