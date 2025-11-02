import React, { useState, forwardRef } from 'react';
import Image from 'next/image';
import ShowIcon from '@/public/icons/show_icon.svg';
import HideIcon from '@/public/icons/hide_icon.svg';

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
  const inputType = isPasswordField && showPassword ? 'text' : props.type;
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-500 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          {...props}
          type={inputType}
          maxLength={props.maxLength || (props.type === 'email' ? 100 : props.type === 'password' ? 12 : undefined)}
          className={`
            w-full px-4 py-3 border rounded-xl
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${props.disabled ? 'bg-gray-50 text-gray-600' : 'bg-white'}
            ${showPasswordToggle && isPasswordField ? 'pr-12' : 'pr-4'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${className}
          `}
        />
        {icon && !(showPasswordToggle && isPasswordField) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        {showPasswordToggle && isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 hover:opacity-70"
          >
            <Image
              src={showPassword ? ShowIcon.src : HideIcon.src}
              alt={showPassword ? 'Hide password' : 'Show password'}
              width={24}
              height={24}
            />
          </button>
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
