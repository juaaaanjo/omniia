import { useState, useCallback, useRef } from 'react';
import { FiUpload, FiFile, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useExcelTransactions } from '../../hooks/useExcelTransactions';
import { useLanguage } from '../../hooks/useLanguage';

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const { translate } = useLanguage();
  const { uploadFile, isUploading, uploadResult, clearUploadResult } = useExcelTransactions();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  // File validation
  const validateFile = useCallback((file) => {
    // Check file size (15MB max)
    const maxSize = 15 * 1024 * 1024; // 15MB in bytes
    if (file.size > maxSize) {
      return translate('excelTransactions.validation.fileSizeExceeds');
    }

    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.oasis.opendocument.spreadsheet' // .ods
    ];
    const allowedExtensions = ['.xlsx', '.xls', '.ods'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      return translate('excelTransactions.validation.invalidFileType');
    }

    return null;
  }, [translate]);

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    setValidationError(null);
    clearUploadResult();

    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }, [validateFile, clearUploadResult]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadFile(selectedFile);
      setSelectedFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      if (onUploadError) {
        onUploadError(error);
      }
    }
  };

  // Handle clear
  const handleClear = () => {
    setSelectedFile(null);
    setValidationError(null);
    clearUploadResult();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 bg-gray-50 hover:border-primary-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white">
            <FiUpload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {translate('excelTransactions.upload.title')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {translate('excelTransactions.upload.dragAndDrop')}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {translate('excelTransactions.upload.chooseFile')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.ods"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="text-xs text-gray-500">
            {translate('excelTransactions.upload.supportedFormats')}
          </div>
        </div>
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{validationError}</p>
        </div>
      )}

      {/* Selected file */}
      {selectedFile && !validationError && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <FiFile className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-600">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isUploading}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Upload button */}
      {selectedFile && !validationError && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {translate('excelTransactions.upload.uploading')}
            </>
          ) : (
            <>
              <FiUpload className="w-5 h-5" />
              {translate('excelTransactions.upload.uploadFile')}
            </>
          )}
        </button>
      )}

      {/* Upload result */}
      {uploadResult && (
        <div className={`p-4 rounded-lg border ${
          uploadResult.success
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${
              uploadResult.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {uploadResult.success ? (
                <FiCheck className="w-5 h-5" />
              ) : (
                <FiAlertCircle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-medium mb-2 ${
                uploadResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {uploadResult.message || (uploadResult.success ? translate('excelTransactions.uploadResult.success') : translate('excelTransactions.uploadResult.failed'))}
              </h4>

              {uploadResult.data && (
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-700">
                      <span className="font-medium">{translate('excelTransactions.uploadResult.file')}</span> {uploadResult.data.fileName}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">{translate('excelTransactions.uploadResult.totalRows')}</span> {uploadResult.data.totalRows}
                    </div>
                    <div className="text-green-700">
                      <span className="font-medium">{translate('excelTransactions.uploadResult.imported')}</span> {uploadResult.data.imported}
                    </div>
                    <div className="text-blue-700">
                      <span className="font-medium">{translate('excelTransactions.uploadResult.updated')}</span> {uploadResult.data.updated}
                    </div>
                    {uploadResult.data.errors > 0 && (
                      <div className="text-red-700">
                        <span className="font-medium">{translate('excelTransactions.uploadResult.errors')}</span> {uploadResult.data.errors}
                      </div>
                    )}
                  </div>

                  {/* Error details */}
                  {uploadResult.data.errorDetails && uploadResult.data.errorDetails.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium text-red-900 mb-2">{translate('excelTransactions.uploadResult.errorDetails')}</p>
                      <div className="max-h-40 overflow-y-auto space-y-1 bg-white p-2 rounded border border-red-200">
                        {uploadResult.data.errorDetails.slice(0, 50).map((err, idx) => (
                          <div key={idx} className="text-xs text-red-700">
                            <span className="font-medium">{translate('excelTransactions.uploadResult.row')} {err.row}:</span> {err.error}
                          </div>
                        ))}
                        {uploadResult.data.errorDetails.length > 50 && (
                          <p className="text-xs text-red-600 font-medium">
                            {translate('excelTransactions.uploadResult.moreErrors').replace('{count}', uploadResult.data.errorDetails.length - 50)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleClear}
                className={`mt-3 text-sm font-medium ${
                  uploadResult.success ? 'text-green-700 hover:text-green-800' : 'text-red-700 hover:text-red-800'
                }`}
              >
                {translate('excelTransactions.uploadResult.dismiss')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
