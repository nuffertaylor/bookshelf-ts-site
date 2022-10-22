import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ColorSchemeCtxProvider } from './ColorSchemeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.Fragment>
    <ColorSchemeCtxProvider>
      <App/>
    </ColorSchemeCtxProvider>
  </React.Fragment>
);