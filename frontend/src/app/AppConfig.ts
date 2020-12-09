export interface AppConfig {
  apiURL: string;
  appEnv: string;
  devMode: boolean;
}

export function getAppConfig(): AppConfig {
  return configFromWindow() || configFromEnv();
}

function configFromWindow(): AppConfig {
  return (window as any).__APP__CONFIG__ as AppConfig;
}

function configFromEnv(): AppConfig {
  return {
    apiURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
    appEnv: process.env.REACT_APP_APP_ENV || 'dev',
    devMode: process.env.REACT_APP_DEV_MODE === 'true',
  } as AppConfig;
}
