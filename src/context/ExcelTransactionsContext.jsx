import { createContext, useState, useCallback, useEffect } from 'react';
import dataService from '../services/dataService';
import { useAuth } from '../hooks/useAuth';

export const ExcelTransactionsContext = createContext(null);

export const ExcelTransactionsProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Upload state
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [uploadDetails, setUploadDetails] = useState(null);

  // Analytics state
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [revenue, setRevenue] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [topCustomers, setTopCustomers] = useState(null);
  const [revenueByLocation, setRevenueByLocation] = useState(null);
  const [taxes, setTaxes] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  /**
   * Upload Excel file
   */
  const uploadFile = useCallback(async (file) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadResult(null);

      const result = await dataService.uploadExcelTransactions(file);
      setUploadResult(result);

      // Refresh uploads list after successful upload
      await fetchUploads();

      return result;
    } catch (error) {
      // Handle new backend error format
      let errorMessage = 'Failed to upload file';
      let uploadResultData = null;

      if (error.response?.data) {
        const responseData = error.response.data;

        // If backend returns structured error response, use it for uploadResult
        if (responseData.success === false) {
          uploadResultData = {
            success: false,
            message: responseData.message || errorMessage,
            error: responseData.error
          };
        }

        // Check for structured error response with error code
        if (responseData.error?.code) {
          const errorCode = responseData.error.code;

          // Map error codes to user-friendly messages
          // The backend now provides detailed error information
          if (errorCode === 'FILE_TOO_LARGE') {
            // Use backend message which includes the max size
            errorMessage = responseData.message || 'File size exceeds the maximum allowed limit';
          } else if (errorCode === 'INVALID_FILE_TYPE') {
            errorMessage = responseData.message || 'Only Excel files (.xlsx, .xls, .ods) are allowed';
          } else {
            // For other error codes, use the backend message
            errorMessage = responseData.message || errorMessage;
          }
        } else if (responseData.message) {
          // Use backend message if available (even without error code)
          errorMessage = responseData.message;
        } else if (responseData.error) {
          // Legacy error format
          errorMessage = responseData.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Set both error message and uploadResult for UI display
      setError(errorMessage);
      if (uploadResultData) {
        setUploadResult(uploadResultData);
      }

      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Fetch all uploads (history)
   */
  const fetchUploads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getExcelTransactionUploads();
      setUploads(data.data || data || []);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch uploads';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch upload details
   */
  const fetchUploadDetails = useCallback(async (uploadId) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getExcelTransactionUploadDetails(uploadId);
      setUploadDetails(data.data || data);
      setSelectedUpload(uploadId);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch upload details';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete upload
   */
  const deleteUpload = useCallback(async (uploadId) => {
    try {
      setIsLoading(true);
      setError(null);
      await dataService.deleteExcelTransactionUpload(uploadId);

      // Refresh uploads list after deletion
      await fetchUploads();

      // Clear selected upload if it was deleted
      if (selectedUpload === uploadId) {
        setSelectedUpload(null);
        setUploadDetails(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete upload';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [selectedUpload, fetchUploads]);

  /**
   * Fetch revenue summary
   */
  const fetchRevenue = useCallback(async (startDate = null, endDate = null) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getExcelTransactionRevenue(
        startDate || dateRange.startDate,
        endDate || dateRange.endDate
      );
      setRevenue(data.data || data);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch revenue';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  /**
   * Fetch daily revenue
   */
  const fetchDailyRevenue = useCallback(async (startDate = null, endDate = null) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getExcelTransactionDailyRevenue(
        startDate || dateRange.startDate,
        endDate || dateRange.endDate
      );
      setDailyRevenue(data.data || data);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch daily revenue';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  /**
   * Fetch payment methods
   */
  const fetchPaymentMethods = useCallback(async (startDate = null, endDate = null) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getExcelTransactionPaymentMethods(
        startDate || dateRange.startDate,
        endDate || dateRange.endDate
      );
      setPaymentMethods(data.data || data);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch payment methods';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  /**
   * Fetch top customers
   */
  const fetchTopCustomers = useCallback(async (startDate = null, endDate = null, limit = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getExcelTransactionTopCustomers(
        startDate || dateRange.startDate,
        endDate || dateRange.endDate,
        limit
      );
      setTopCustomers(data.data || data);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch top customers';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  /**
   * Fetch revenue by location
   */
  const fetchRevenueByLocation = useCallback(async (startDate = null, endDate = null) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getExcelTransactionRevenueByLocation(
        startDate || dateRange.startDate,
        endDate || dateRange.endDate
      );
      setRevenueByLocation(data.data || data);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch revenue by location';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  /**
   * Fetch taxes
   */
  const fetchTaxes = useCallback(async (startDate = null, endDate = null) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getExcelTransactionTaxes(
        startDate || dateRange.startDate,
        endDate || dateRange.endDate
      );
      setTaxes(data.data || data);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch taxes';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  /**
   * Fetch all analytics data at once
   */
  const fetchAllAnalytics = useCallback(async (startDate = null, endDate = null) => {
    try {
      setIsLoading(true);
      setError(null);

      await Promise.all([
        fetchRevenue(startDate, endDate),
        fetchDailyRevenue(startDate, endDate),
        fetchPaymentMethods(startDate, endDate),
        fetchTopCustomers(startDate, endDate),
        fetchRevenueByLocation(startDate, endDate),
        fetchTaxes(startDate, endDate)
      ]);
    } catch (error) {
      console.error('Failed to fetch all analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchRevenue, fetchDailyRevenue, fetchPaymentMethods, fetchTopCustomers, fetchRevenueByLocation, fetchTaxes]);

  /**
   * Update date range
   */
  const updateDateRange = useCallback((startDate, endDate) => {
    setDateRange({ startDate, endDate });
  }, []);

  /**
   * Clear upload result
   */
  const clearUploadResult = useCallback(() => {
    setUploadResult(null);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load uploads on mount (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      return;
    }

    fetchUploads().catch(err => {
      console.warn('Initial uploads fetch failed:', err);
    });
  }, [isAuthenticated, authLoading, fetchUploads]);

  const value = {
    // Upload state
    uploads,
    selectedUpload,
    uploadDetails,

    // Analytics state
    dateRange,
    revenue,
    dailyRevenue,
    paymentMethods,
    topCustomers,
    revenueByLocation,
    taxes,

    // UI state
    isLoading,
    isUploading,
    error,
    uploadResult,

    // Actions
    uploadFile,
    fetchUploads,
    fetchUploadDetails,
    deleteUpload,
    fetchRevenue,
    fetchDailyRevenue,
    fetchPaymentMethods,
    fetchTopCustomers,
    fetchRevenueByLocation,
    fetchTaxes,
    fetchAllAnalytics,
    updateDateRange,
    clearUploadResult,
    clearError,
  };

  return (
    <ExcelTransactionsContext.Provider value={value}>
      {children}
    </ExcelTransactionsContext.Provider>
  );
};
