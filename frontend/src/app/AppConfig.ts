export interface AppConfig {
  apiURL: string;
  appEnv: string;
}

export function getAppConfig(): AppConfig {
  return configFromWindow() || configFromEnv();
}

function configFromWindow(): AppConfig {
  return (window as any).__APP__CONFIG__ as AppConfig;
}

function configFromEnv(): AppConfig {
  return {
    apiURL: process.env.REACT_APP_API_URL,
    appEnv: process.env.REACT_APP_APP_ENV,
  } as AppConfig;
}
