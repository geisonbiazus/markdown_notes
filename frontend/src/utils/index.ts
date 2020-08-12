export * from './uuid';
export * from './HTTPClient';

export const isEmpty = (record: Record<any, any>): boolean => {
  return Object.keys(record).length === 0;
};
