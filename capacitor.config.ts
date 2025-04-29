
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.da17b1770aa54c62b0ce9033c5ef3dcd',
  appName: 'memory-forge-app',
  webDir: 'dist',
  server: {
    url: 'https://da17b177-0aa5-4c62-b0ce-9033c5ef3dcd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'my-release-key.keystore',
      keystorePassword: 'password',
      keystoreAlias: 'alias_name',
      keystoreAliasPassword: 'password',
    }
  }
};

export default config;
