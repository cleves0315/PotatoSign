import React from 'react';

interface Props {
  title: string;
}

const Content = ({ title }: Props) => {
  return <div className="ContentContainer">{title} Page</div>;
};

export default Content;
