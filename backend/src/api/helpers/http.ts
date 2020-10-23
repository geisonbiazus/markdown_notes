import { InteractorResponse } from '../../utils/interactor';

export const resolveHttpStatus = <T>(response: InteractorResponse<T>): number => {
  const { status, type } = response;

  return (
    (status === 'success' && 200) ||
    (status === 'error' && type === 'not_found' && 404) ||
    (status === 'validation_error' && 422) ||
    500
  );
};
