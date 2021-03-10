export interface ErrorResponse {
  status: 'error';
  type: string;
}

export function errorResponse(type: string): ErrorResponse {
  return { status: 'error', type };
}
