import { useState } from 'react';
import { FiUpload, FiList, FiBarChart2 } from 'react-icons/fi';
import FileUpload from '../components/excelTransactions/FileUpload';
import UploadsList from '../components/excelTransactions/UploadsList';
import AnalyticsDashboard from '../components/excelTransactions/AnalyticsDashboard';
import { useLanguage } from '../hooks/useLanguage';

const ExcelTransactions = () => {
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState('upload');

  const tabs = [
    { id: 'upload', name: translate('excelTransactions.tabs.upload'), icon: FiUpload },
    { id: 'history', name: translate('excelTransactions.tabs.history'), icon: FiList },
    { id: 'analytics', name: translate('excelTransactions.tabs.analytics'), icon: FiBarChart2 }
  ];

  const handleUploadSuccess = (result) => {
    // Switch to analytics tab after successful upload
    if (result.success) {
      setTimeout(() => {
        setActiveTab('analytics');
      }, 2000);
    }
  };

  const handleSelectUpload = (uploadId) => {
    // Navigate to analytics for the selected upload
    setActiveTab('analytics');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{translate('excelTransactions.title')}</h1>
        <p className="text-gray-600 mt-1">
          {translate('excelTransactions.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pb-12">
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {translate('excelTransactions.upload.title')}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {translate('excelTransactions.upload.description')}
              </p>
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) => console.error('Upload error:', error)}
              />
            </div>

            {/* Instructions */}
            <div className="mt-6 card p-6 bg-blue-50">
              <h3 className="text-sm font-medium text-blue-900 mb-3">
                {translate('excelTransactions.fileRequirements.title')}
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{translate('excelTransactions.fileRequirements.format')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{translate('excelTransactions.fileRequirements.maxSize')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{translate('excelTransactions.fileRequirements.autoDetect')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{translate('excelTransactions.fileRequirements.detailedSummary')}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto">
            <UploadsList onSelectUpload={handleSelectUpload} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </div>
    </div>
  );
};

export default ExcelTransactions;
