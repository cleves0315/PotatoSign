import { ThemeSwitch } from '@/components';
import React from 'react';
import './index.scss';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <div className="header">
      <div className="header-logo"></div>
      <h1>Potato Tag</h1>
      <ThemeSwitch />
    </div>
  );
};
