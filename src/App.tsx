import React from 'react';

import Routes from './routes';

import CreateGlobalStyle from './styles/global';
import 'leaflet/dist/leaflet.css';

const App: React.FC = () => (
  <>
    <Routes />
    <CreateGlobalStyle />
  </>
);

export default App;
