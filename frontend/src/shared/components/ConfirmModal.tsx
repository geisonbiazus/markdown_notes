import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';

export interface ConfirmModalProps {
  open?: boolean;
  title?: string;
  message?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { t } = useTranslation();
  const {
    open = false,
    title = t('Confirmation'),
    message = t('Are you sure?'),
    cancelLabel = t('Cancel'),
    confirmLabel = t('Confirm'),
    onCancel,
    onConfirm,
  } = props;

  return (
    <Modal show={open} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
