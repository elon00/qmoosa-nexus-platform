import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against Web3 extension property redefinition errors and unhandled MetaMask rejections
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (msg.includes('ethereum') || msg.includes('MetaMask') || msg.includes('Cannot redefine property')) {
      console.warn('Handled Web3/MetaMask global window error:', msg);
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (reason.includes('ethereum') || reason.includes('MetaMask') || reason.includes('eth_requestAccounts')) {
      console.warn('Handled Web3/MetaMask promise rejection:', reason);
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

