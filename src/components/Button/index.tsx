import React, { useState } from 'react';
import './index.scss';

type type = 'default' | 'primary' | string;
type size = 'small' | 'large';

export interface ButtonProps {
  type?: type;
  size?: size;
  className?: string;
  children: string;
  disabled?: boolean;
  style?: object;
  onClick?: (e: any) => void;
}

export const Button = ({
  children,
  type = 'default',
  size = 'small',
  className = '',
  disabled,
  style = {},
  onClick,
}: ButtonProps) => {
  const handleOnClick = (e: any) => {
    onClick && !disabled && onClick(e);
  };

  return (
    <button
      className={`button ${className} ${type} ${size} ${
        disabled ? 'disabled' : ''
      }`}
      style={style}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
};
