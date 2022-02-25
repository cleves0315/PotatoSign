import React, { useState } from 'react';
import './index.scss';

type type = 'default' | 'primary' | string;
type size = 'small' | 'large';
interface Props {
  type?: type;
  size?: size;
  children: string;
  disabled?: boolean;
  onClick?: (e: any) => void;
}

const DropdownMenu: React.FC<Props> = ({
  children,
  type = 'default',
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
