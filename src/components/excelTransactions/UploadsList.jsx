import { useState } from 'react';
import { FiFile, FiTrash2, FiCalendar, FiDollarSign, FiRefreshCw, FiChevronRight } from 'react-icons/fi';
import { useExcelTransactions } from '../../hooks/useExcelTransactions';
import { useLanguage } from '../../hooks/useLanguage';

const UploadsList = ({ onSelectUpload }) => {
  const { translate } = useLanguage();
  const { uploads, isLoading, fetchUploads, deleteUpload } = useExcelTransactions();
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Handle delete
  const handleDelete = async (uploadId) => {
    try {
      setDeletingId(uploadId);
      await deleteUpload(uploadId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete upload:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await fetchUploads();
    } catch (error) {
      console.error('Failed to refresh uploads:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date range
  const formatDateRange = (dateRange) => {
    if (!dateRange || !dateRange.min || !dateRange.max) return 'N/A';
    const min = new Date(dateRange.min).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const max = new Date(dateRange.max).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${min} - ${max}`;
  };

  // Format currency (Colombian Pesos)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // Empty state
  if (!uploads || uploads.length === 0) {
    return (
      <div className="card p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFile className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{translate('excelTransactions.uploadsList.noUploads')}</h3>
          <p className="text-sm text-gray-600">
            {translate('excelTransactions.uploadsList.noUploadsDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{translate('excelTransactions.uploadsList.title')}</h3>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          title={translate('excelTransactions.uploadsList.refresh')}
        >
          <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Uploads list */}
      <div className="space-y-3">
        {uploads.map((upload) => (
          <div key={upload.uploadId} className="card card-hover p-4">
            <div className="flex items-start justify-between gap-4">
              {/* Upload info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <FiFile className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {upload.fileName}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {translate('excelTransactions.uploadsList.uploaded')} {formatDate(upload.uploadedAt)}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <FiFile className="w-4 h-4" />
                      <span className="text-xs">{translate('excelTransactions.uploadsList.transactions')}</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatNumber(upload.transactionCount)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <FiDollarSign className="w-4 h-4" />
                      <span className="text-xs">{translate('excelTransactions.uploadsList.revenue')}</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(upload.totalRevenue)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <FiCalendar className="w-4 h-4" />
                      <span className="text-xs">{translate('excelTransactions.uploadsList.dateRange')}</span>
                    </div>
                    <p className="font-medium text-gray-900 text-xs">
                      {formatDateRange(upload.dateRange)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {onSelectUpload && (
                  <button
                    onClick={() => onSelectUpload(upload.uploadId)}
                    className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                    title={translate('excelTransactions.uploadsList.viewDetails')}
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(upload.uploadId)}
                  disabled={deletingId === upload.uploadId}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title={translate('excelTransactions.uploadsList.delete')}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Delete confirmation */}
            {showDeleteConfirm === upload.uploadId && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900 mb-3">
                  {translate('excelTransactions.uploadsList.deleteConfirm')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(upload.uploadId)}
                    disabled={deletingId === upload.uploadId}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === upload.uploadId ? translate('excelTransactions.uploadsList.deleting') : translate('excelTransactions.uploadsList.delete')}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={deletingId === upload.uploadId}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {translate('excelTransactions.uploadsList.cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadsList;
