// Populating placeholder file with UI component implementations.
import React, { ReactNode } from 'react';
import { useData } from '../context/DataContext';

// Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`bg-surface rounded-lg shadow p-6 ${className}`} {...props}>
    {children}
  </div>
);

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-focus focus:ring-primary',
    secondary: 'bg-gray-600 text-text-primary hover:bg-gray-500 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const Input: React.FC<InputProps> = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    />
  </div>
);

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}
export const Select: React.FC<SelectProps> = ({ label, name, children, ...props }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      >
        {children}
      </select>
    </div>
);


// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
         <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// ConfirmModal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}
export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-surface rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
           <div className="p-6">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="text-text-secondary mb-6">{children}</div>
                <div className="flex justify-end gap-4">
                    <Button variant="secondary" onClick={onClose}>Zrušit</Button>
                    <Button variant="danger" onClick={onConfirm}>Potvrdit</Button>
                </div>
           </div>
        </div>
      </div>
    );
};

// Toast
export const ToastContainer: React.FC = () => {
    const { toasts } = useData();

    const getToastColors = (type: 'success' | 'error' | 'info') => {
        switch (type) {
            case 'success': return 'bg-green-600';
            case 'error': return 'bg-red-600';
            case 'info': return 'bg-blue-600';
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 space-y-2">
            {toasts.map(toast => (
                <div key={toast.id} className={`px-4 py-2 rounded-md text-white text-sm shadow-lg ${getToastColors(toast.type)}`}>
                    {toast.message}
                </div>
            ))}
        </div>
    );
};
