import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '../hooks/useLanguage';
import { ROUTES } from '../utils/constants';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center">
          {/* Animated 404 */}
          <div className="mb-8 relative">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 animate-pulse">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FiAlertCircle className="w-20 h-20 text-primary-200 animate-bounce" />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.notFound.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t.notFound.message}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTES.DASHBOARD}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FiHome className="w-5 h-5" />
                {t.notFound.goHome}
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105"
              >
                <FiArrowLeft className="w-5 h-5" />
                {t.notFound.goBack}
              </button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-4">{t.notFound.helpfulLinks}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to={ROUTES.MARKETING}
                className="px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {t.nav.marketing}
              </Link>
              <Link
                to={ROUTES.FINANCE}
                className="px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {t.nav.finance}
              </Link>
              <Link
                to={ROUTES.ANALYTICS}
                className="px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {t.nav.analytics}
              </Link>
              <Link
                to={ROUTES.FORECASTING}
                className="px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {t.nav.forecasting}
              </Link>
              <Link
                to={ROUTES.PLANNING}
                className="px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {t.nav.planning}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
