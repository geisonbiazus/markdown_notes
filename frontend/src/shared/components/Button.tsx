import React from 'react';
import { Button as BootstrapButton, Spinner } from 'react-bootstrap';
import './Button.css';

export interface ButtonProps {
  variant?: string;
  type?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { variant, type, onClick, disabled, loading, children } = props;

  return (
    <BootstrapButton variant={variant} type={type} onClick={onClick} disabled={disabled}>
      {children}
      {loading && <Spinner className="ml-2" as="span" animation="border" size="sm" />}
    </BootstrapButton>
  );
};
