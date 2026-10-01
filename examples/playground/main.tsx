import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@corinovate/react-data-table/styles.css';
import './playground.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
