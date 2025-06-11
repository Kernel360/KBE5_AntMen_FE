'use client';

import React from 'react';

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface ErrorStateProps {
  icon?: string;
  title: string;
  description?: string;
  details?: string;
  actions?: ActionButton[];
  className?: string;
}

export const ErrorState = ({
  icon = '🚧',
  title,
  description,
  details,
  actions,
  className = '',
}: ErrorStateProps) => {
  return (
    <div className={`flex flex-1 flex-col bg-white ${className}`}>
      {/* Content */}
      <div className="flex flex-1 flex-col gap-6 p-5">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="text-6xl">{icon}</div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {description && (
            <p className="text-center text-gray-600">{description}</p>
          )}
          {details && (
            <p className="text-center text-sm text-gray-500">{details}</p>
          )}
          
          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`w-full rounded-xl py-3 font-medium transition-colors ${
                    action.variant === 'primary'
                      ? 'bg-[#4DD0E1] text-white hover:bg-[#26C6DA]'
                      : action.variant === 'danger'
                      ? 'border border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 