import React from 'react';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  return <div className="ContentContainer">{title} Page</div>;
};

export default Options;
