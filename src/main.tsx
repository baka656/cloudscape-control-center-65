
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './config/aws-config.ts';

// Polyfills for AWS SDK
window.global = window;
window.process = { env: {} };

// Configure Amplify
Amplify.configure(amplifyConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
