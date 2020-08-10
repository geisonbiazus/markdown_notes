export interface AppConfig {
  apiURL: string;
  appEnv: string;
}

export const getAppConfig = (): AppConfig => {
  return configFromWindow() || configFromEnv();
};

const configFromWindow = (): AppConfig => {
  return (window as any).__APP__CONFIG__ as AppConfig;
};

const configFromEnv = () => {
  return {
    apiURL: process.env.REACT_APP_API_URL,
    appEnv: process.env.REACT_APP_APP_ENV,
  } as AppConfig;
};
