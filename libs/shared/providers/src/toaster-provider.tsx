'use client';

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position={'bottom-center'}
      toastOptions={{
        style: {
          zIndex: 99999999, // Set your desired z-index value
        },
      }}
    />
  );
};
