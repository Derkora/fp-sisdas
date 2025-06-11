import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryConfig } from './lib/react-query';

import { StatusBar } from '@capacitor/status-bar';

const container = document.getElementById('root');
const root = createRoot(container!);

const queryClient: QueryClient = new QueryClient({
  defaultOptions: queryConfig,
});

const AppWithStatusBar: React.FC = () => {
  useEffect(() => {
    const setupStatusBar = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch (err) {
        throw new Error('StatusBar setup failed');
      }
    };

    setupStatusBar();
  }, []);

  return <App />;
};

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWithStatusBar />
    </QueryClientProvider>
  </React.StrictMode>
);
