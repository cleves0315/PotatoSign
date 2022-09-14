import React from 'react';
import { Header, Footer, TabsList } from './components';

import './index.scss';

interface Props {}

const Options: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <TabsList />
      <Footer />
    </div>
  );
};

export default Options;
