import React from 'react';
import { FormProps as BootstrapFormProps, Form as BootstrapForm } from 'react-bootstrap';
import { ErrorMessage } from './ErrorMessage';

export interface FormProps extends BootstrapFormProps {}

export const Form: React.FC<FormProps> = (props) => {
  return <BootstrapForm noValidate {...props} />;
};

export const FormRow: React.FC = (props) => {
  return <BootstrapForm.Group {...props} />;
};

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorField?: string;
  errorType?: string;
  disabled?: boolean;
  type?: 'text' | 'password' | 'email';
}

export const TextField: React.FC<TextFieldProps> = (props) => {
  const {
    label,
    placeholder,
    value,
    onChange,
    errorField,
    errorType,
    disabled,
    type = 'text',
  } = props;

  return (
    <>
      <BootstrapForm.Label>{label}</BootstrapForm.Label>
      <BootstrapForm.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isInvalid={!!errorType}
        disabled={disabled}
      />
      <ErrorMessage field={errorField} type={errorType} />
    </>
  );
};

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  errorField?: string;
  errorType?: string;
  disabled?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = (props) => {
  const { label, placeholder, value, onChange, rows, errorField, errorType, disabled } = props;

  return (
    <>
      <BootstrapForm.Label>{label}</BootstrapForm.Label>
      <BootstrapForm.Control
        as="textarea"
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={onChange}
        isInvalid={!!errorType}
        disabled={disabled}
      />
      <ErrorMessage field={errorField} type={errorType} />
    </>
  );
};
