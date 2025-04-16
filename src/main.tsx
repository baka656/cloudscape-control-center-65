
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import { amplifyConfig } from './config/aws-config.ts'

// Polyfills for AWS SDK
window.global = window;
// Use a proper process polyfill
window.process = { 
  env: {},
  // Add minimum required process properties
  stdout: null,
  stderr: null,
  stdin: null,
  argv: [],
  version: '',
  versions: {} as any
};

// Configure Amplify
Amplify.configure(amplifyConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
