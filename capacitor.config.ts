import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pinpots.app',
  appName: 'pinpots',
  webDir: 'build',
  server: {
    url: 'http://localhost:8000',
    cleartext: true,
  },
};

export default config;
