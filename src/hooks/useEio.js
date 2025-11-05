import { useContext } from 'react';
import { EioContext } from '../context/EioContext';

export const useEio = () => {
  const context = useContext(EioContext);

  if (!context) {
    throw new Error('useEio must be used within an EioProvider');
  }

  return context;
};
