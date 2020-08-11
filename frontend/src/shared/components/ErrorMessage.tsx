import React from 'react';

export interface ErrorMessageProps {
  field: string;
  type?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ field, type }) => {
  if (!type) return null;

  return (
    <div>
      {field} {type}
    </div>
  );
};
