import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles — order matters: tokens first, then base, then effects
import './styles/theme.css';
import './styles/globals.css';
import './styles/animations.css';
import './styles/scrollEffects.css';
import './styles/components.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
