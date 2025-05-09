import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300'
};

const sizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`rounded ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}; 