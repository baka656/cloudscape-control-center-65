
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import { amplifyConfig } from './config/aws-config.ts'

// Polyfills for AWS SDK
window.global = window;
// Use a proper process polyfill that satisfies TS
window.process = {
  env: {},
  // Add minimum required process properties
  stdout: null,
  stderr: null,
  stdin: null,
  argv: [],
  execArgv: [],
  execPath: '',
  abort: () => {},
  chdir: () => {},
  cwd: () => '',
  exit: () => {},
  version: '',
  versions: {} as any,
  platform: '',
  kill: () => false,
  nextTick: () => {},
} as unknown as NodeJS.Process;

// Configure Amplify
Amplify.configure(amplifyConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
