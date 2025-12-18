import { useContext } from 'react';
import { ExcelTransactionsContext } from '../context/ExcelTransactionsContext';

export const useExcelTransactions = () => {
  const context = useContext(ExcelTransactionsContext);

  if (!context) {
    throw new Error('useExcelTransactions must be used within an ExcelTransactionsProvider');
  }

  return context;
};
