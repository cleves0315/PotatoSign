import { ThemeSwitch } from '@/components';
import React from 'react';
import './index.scss';

export const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-logo"></div>
      <h1>Potato Tag</h1>
      <ThemeSwitch />
    </div>
  );
};
