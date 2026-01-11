'use client';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster, useToasterStore } from 'react-hot-toast';
import { useEffect } from 'react';

function ToastSoundPlayer() {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .forEach((t) => {
        if (t.type === 'success' || t.type === 'error') {
          const successSound = 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3';
          const errorSound = 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3';

          const audio = new Audio(t.type === 'success' ? successSound : errorSound);
          audio.volume = 0.3;
          audio.play().catch(() => {
          });
        }
      });
  }, [toasts]);

  return null;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <ToastSoundPlayer />

      {children}

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-card)',
            backdropFilter: 'blur(12px)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            fontSize: '11px',
            textTransform: 'uppercase',
            fontWeight: '800',
            letterSpacing: '0.15em',
            padding: '14px 20px',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(42, 15, 15, 0.08)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-bg)',
            },
            style: {
              borderLeft: '4px solid var(--color-primary)',
            },
          },
          error: {
            style: {
              borderLeft: '4px solid #ff4b2b',
            },
          },
        }}
      />
    </Provider>
  );
}
