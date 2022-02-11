import React, { useState } from 'react';
import './index.scss';

interface Props {
  type?: 'primary';
  size?: 'small' | 'large';
  children: string;
  disabled?: boolean;
  onClick?: (e: any) => void;
}

const DropdownMenu: React.FC<Props> = ({
  children,
  type,
  size,
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
