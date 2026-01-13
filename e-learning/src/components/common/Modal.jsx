import React from 'react';

const Modal = ({ title, children, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', open, confirmDisabled = false }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-full sm:max-w-lg w-full p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onCancel} className="text-gray-500">✕</button>
        </div>
        <div className="mt-4">{children}</div>
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button onClick={onCancel} className="w-full sm:w-auto px-4 py-2 rounded bg-gray-100">{cancelLabel}</button>
          <button onClick={onConfirm} disabled={confirmDisabled} className={`w-full sm:w-auto px-4 py-2 rounded text-white ${confirmDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
