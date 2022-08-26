import React, { useState } from 'react';
import './index.scss';

type type = 'default' | 'primary' | string;
type size = 'small' | 'large';
interface Props {
  type?: type;
  size?: size;
  className?: string;
  children: string;
  disabled?: boolean;
  style?: object;
  onClick?: (e: any) => void;
}

export const Button: React.FC<Props> = ({
  children,
  type = 'default',
  size = 'small',
  className = '',
  disabled,
  style = {},
  onClick,
}: Props) => {
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
