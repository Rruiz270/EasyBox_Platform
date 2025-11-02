'use client';

import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

export default function Toast({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  autoClose = true, 
  duration = 5000 
}: ToastProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
      iconBg: 'bg-green-100',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-red-400" />,
      iconBg: 'bg-red-100',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />,
      iconBg: 'bg-yellow-100',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <CheckCircleIcon className="h-5 w-5 text-blue-400" />,
      iconBg: 'bg-blue-100',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700'
    }
  };

  const style = typeStyles[type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`rounded-md border p-4 ${style.bg} ${style.border}`}>
        <div className="flex">
          <div className={`flex-shrink-0 rounded-full p-1 ${style.iconBg}`}>
            {style.icon}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${style.titleColor}`}>
              {title}
            </h3>
            {message && (
              <p className={`mt-1 text-sm ${style.messageColor}`}>
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md text-gray-400 hover:text-gray-600 focus:outline-none`}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}