import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'fp-sisdas-project',
  webDir: 'dist',
  plugins: {
    keyboard: {
      resize: 'body'
    },
    LocalNotifications: {
      smallIcon: "ic_stat_logo",
      iconColor: "#488AFF",
    },
    GPSPlugin: {}
  }
};

export default config;
