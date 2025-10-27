import React, { useState, forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  helperText, 
  icon, 
  showPasswordToggle = false,
  className = '', 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = props.type === 'password';

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={isPasswordField && showPassword ? 'text' : props.type}
          maxLength={props.maxLength || (props.type === 'email' ? 100 : props.type === 'password' ? 12 : undefined)}
          className={`
            w-full px-4 py-3 border rounded-xl
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${props.disabled ? 'bg-gray-50 text-gray-600' : 'bg-white'}
            ${showPasswordToggle && isPasswordField ? 'pr-12' : 'pr-4'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${className}
          `}
          {...props}
        />
        {showPasswordToggle && isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
