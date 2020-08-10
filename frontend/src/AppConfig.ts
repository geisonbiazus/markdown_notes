export interface AppConfig {
  apiURL: string;
}

export const getAppConfig = (): AppConfig => {
  return {
    apiURL: 'http://localhost:4000',
  };
};
