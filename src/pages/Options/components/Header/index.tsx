import { ThemeSwitch } from '@/components';
import React from 'react';
import './index.scss';

interface HeaderProps {
  onContextMenu?: () => void;
}

export const Header = ({ onContextMenu }: HeaderProps) => {
  return (
    <div className="header" onContextMenu={onContextMenu}>
      <div className="header-logo"></div>
      <h1>Potato Tag</h1>
      <ThemeSwitch />
    </div>
  );
};