import { useCallback, useState } from 'react';

export function useAsyncAction<TReturn>(
  actionFn: () => Promise<TReturn>
): {
  execute: () => Promise<TReturn>;
  pending: boolean;
};

export function useAsyncAction<TReturn, TArg1>(
  actionFn: (a1: TArg1) => Promise<TReturn>
): {
  execute: (a1: TArg1) => Promise<TReturn>;
  pending: boolean;
};

export function useAsyncAction<TReturn, TArg1, TArg2>(
  actionFn: (a1: TArg1, a2: TArg2) => Promise<TReturn>
): {
  execute: (a1: TArg1, a2: TArg2) => Promise<TReturn>;
  pending: boolean;
};

export function useAsyncAction<TReturn, TArg1, TArg2, TArg3>(
  actionFn: (a1: TArg1, a2: TArg2, a3: TArg3) => Promise<TReturn>
): {
  execute: (a1: TArg1, a2: TArg2, a3: TArg3) => Promise<TReturn>;
  pending: boolean;
};

export function useAsyncAction<TReturn>(actionFn: (...args: any[]) => Promise<TReturn>) {
  const [pending, setPending] = useState(false);

  const execute = useCallback(
    async (...args: any[]) => {
      setPending(true);
      const response = await actionFn(...args);
      setPending(false);
      return response;
    },
    [actionFn]
  );
  return {
    execute,
    pending,
  };
}
