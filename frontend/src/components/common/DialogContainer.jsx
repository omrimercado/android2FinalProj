import React from 'react';
import { useDialog } from '../../contexts/DialogContext';
import Dialog from './Dialog';

const DialogContainer = () => {
  const { dialog, closeDialog } = useDialog();

  if (!dialog) return null;

  return (
    <Dialog
      message={dialog.message}
      type={dialog.type}
      title={dialog.title}
      onClose={closeDialog}
      isConfirm={dialog.isConfirm}
      onConfirm={dialog.onConfirm}
      onCancel={dialog.onCancel}
    />
  );
};

export default DialogContainer;
