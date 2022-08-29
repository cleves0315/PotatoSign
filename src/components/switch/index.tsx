import React, { useState } from 'react';
import './index.scss';
interface Props {
  className?: string;
}

export const Switch: React.FC<Props> = ({ className }: Props) => {
  return (
    <button className={`p-switch ${className}`}>
      <span className="p-switch-check">
        <span></span>
      </span>
    </button>
  );
};
