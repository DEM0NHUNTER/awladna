// src/components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      onClick={onClose}
    >
      <div
        className="pointer-events-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
