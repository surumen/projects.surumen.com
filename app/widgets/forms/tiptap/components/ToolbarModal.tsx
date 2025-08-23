import React, { useState } from 'react';

interface ToolbarModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  size?: 'sm' | 'lg' | 'xl';
}

const ToolbarModal: React.FC<ToolbarModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Insert',
  size
}) => {
  if (!isOpen) return null;

  const modalClasses = [
    'modal',
    'fade',
    isOpen ? 'show' : ''
  ].filter(Boolean).join(' ');

  const modalDialogClasses = [
    'modal-dialog',
    size && `modal-${size}`
  ].filter(Boolean).join(' ');

  return (
    <>
      <div 
        className={modalClasses}
        style={{ display: 'block' }}
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
      >
        <div className={modalDialogClasses} onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              {onSubmit && (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={onSubmit}
                >
                  {submitText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
};

export default ToolbarModal;
