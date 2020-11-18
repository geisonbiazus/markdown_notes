import React, { SyntheticEvent } from 'react';
import { Form as BootstrapForm } from 'react-bootstrap';
import { FieldErrorMessage } from './ErrorMessage';

export interface FormProps {
  onSubmit: () => void;
}

export const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
  const onSubmitWrapper = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <BootstrapForm noValidate onSubmit={onSubmitWrapper}>
      {children}
    </BootstrapForm>
  );
};

export const FormRow: React.FC = (props) => {
  return <BootstrapForm.Group {...props} />;
};

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
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

  const onChangeWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <>
      <BootstrapForm.Label>{label}</BootstrapForm.Label>
      <BootstrapForm.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChangeWrapper}
        isInvalid={!!errorType}
        disabled={disabled}
      />
      <FieldErrorMessage field={errorField} type={errorType} />
    </>
  );
};

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  rows?: number;
  errorField?: string;
  errorType?: string;
  disabled?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = (props) => {
  const { label, placeholder, value, onChange, rows, errorField, errorType, disabled } = props;

  const onChangeWrapper = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <>
      <BootstrapForm.Label>{label}</BootstrapForm.Label>
      <BootstrapForm.Control
        as="textarea"
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={onChangeWrapper}
        isInvalid={!!errorType}
        disabled={disabled}
      />
      <FieldErrorMessage field={errorField} type={errorType} />
    </>
  );
};
