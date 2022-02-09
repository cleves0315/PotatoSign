import React, { useState } from 'react';
import './index.scss';

interface Props {
  type?: string;
  size?: string;
  children: string;
}

const DropdownMenu: React.FC<Props> = ({ children, type, size }: Props) => {
  return <button className={`button ${type} ${size}`}>{children}</button>;
};

export default DropdownMenu;
