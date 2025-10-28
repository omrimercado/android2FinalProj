import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Dialog.css';

const Dialog = ({ message, type = 'info', title, onClose, isConfirm = false, onConfirm, onCancel }) => {
  useEffect(() => {
    // Close dialog on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isConfirm && onCancel) {
          onCancel();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isConfirm, onCancel]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="dialog-icon success" />;
      case 'error':
        return <FaExclamationCircle className="dialog-icon error" />;
      case 'warning':
        return <FaExclamationTriangle className="dialog-icon warning" />;
      default:
        return <FaInfoCircle className="dialog-icon info" />;
    }
  };

  const getDefaultTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return 'Information';
    }
  };

  const handleOverlayClick = () => {
    if (isConfirm && onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleCloseClick = () => {
    if (isConfirm && onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div className={`dialog-container ${type}`} onClick={(e) => e.stopPropagation()}>
        <button className="dialog-close" onClick={handleCloseClick} aria-label="Close">
          <FaTimes />
        </button>

        <div className="dialog-header">
          {getIcon()}
          <h3 className="dialog-title">{getDefaultTitle()}</h3>
        </div>

        <div className="dialog-body">
          <p className="dialog-message">{message}</p>
        </div>

        <div className="dialog-footer">
          {isConfirm ? (
            <>
              <button className="dialog-button cancel" onClick={onCancel}>
                Cancel
              </button>
              <button className={`dialog-button ${type}`} onClick={onConfirm}>
                Confirm
              </button>
            </>
          ) : (
            <button className={`dialog-button ${type}`} onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
