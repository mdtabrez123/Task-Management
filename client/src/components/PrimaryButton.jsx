import React from 'react';

/**
 * A reusable primary button
 */
const PrimaryButton = ({ type = 'submit', children, onClick, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
  >
    {children}
  </button>
);

export default PrimaryButton;