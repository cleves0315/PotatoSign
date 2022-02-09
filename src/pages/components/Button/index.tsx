import React, { useState } from 'react';
import './index.scss';

interface Props {
  type?: 'primary';
  size?: 'small' | 'large';
  children: string;
  disabled?: boolean;
}

const DropdownMenu: React.FC<Props> = ({
  children,
  type,
  size,
  disabled,
}: Props) => {
  return (
    <button className={`button ${type} ${size} ${disabled ? 'disabled' : ''}`}>
      {children}
    </button>
  );
};

export default DropdownMenu;
