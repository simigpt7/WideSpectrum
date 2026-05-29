import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initMonitoring } from './lib/monitoring';
import { initAnalytics } from './lib/analytics';
import { initUptimeMonitoring } from './lib/uptime';

// Initialise in parallel, non-blocking — none of these affect the render
initAnalytics();
initMonitoring();
initUptimeMonitoring();

// Single root render (was duplicated — now fixed)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
