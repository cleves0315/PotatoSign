import React, { useState } from 'react';
import './index.scss';

interface Props {
  type?: string;
  size?: string; // small' | 'large'
  children: string;
  disabled?: boolean;
  onClick?: (e: any) => void;
}

const DropdownMenu: React.FC<Props> = ({
  children,
  type = 'primary',
  size = 'small',
  disabled,
  onClick,
}: Props) => {
  const handleOnClick = (e: any) => {
    onClick && !disabled && onClick(e);
  };

  return (
    <button
      className={`button ${type} ${size} ${disabled ? 'disabled' : ''}`}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
};

export default DropdownMenu;
