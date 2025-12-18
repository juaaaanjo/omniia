import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiLock, FiAlertCircle, FiCheckCircle, FiTarget } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { validateForm } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import authService from '../services/authService';
import { useLanguage } from '../hooks/useLanguage';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState('');

  // Extract token from URL on mount
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setErrorMessage(t.auth.invalidResetLink || 'Invalid password reset link. Please request a new one.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, t.auth.invalidResetLink]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Check if token exists
    if (!token) {
      setErrorMessage(t.auth.invalidResetLink || 'Invalid password reset link. Please request a new one.');
      return;
    }

    // Validate form
    const validation = validateForm(formData, {
      password: { required: true, minLength: 8 },
      confirmPassword: { required: true, match: formData.password },
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Additional password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: t.auth.passwordsDoNotMatch || 'Passwords do not match' });
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword(token, formData.password);
      setSuccessMessage(t.auth.passwordResetSuccess || 'Password has been reset successfully! Redirecting to dashboard...');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }, 2000);
    } catch (error) {
      // Handle specific errors
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        setErrorMessage(t.auth.tokenExpired || 'Password reset token is invalid or has expired. Please request a new reset link.');
      } else {
        setErrorMessage(error.message || t.auth.resetPasswordError || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 w-72 h-72 bg-emerald-200/35 blur-3xl rounded-full" />
        <div className="absolute right-16 top-20 w-64 h-64 bg-indigo-200/30 blur-3xl rounded-full" />
        <div className="absolute right-10 bottom-10 w-72 h-72 bg-amber-200/25 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-6 py-12">
        {/* Header / brand */}
        <div className="flex items-center justify-between bg-white/80 border border-gray-200 rounded-2xl px-4 py-3 shadow-lg shadow-black/5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-lime-500 shadow-md shadow-green-400/30 grid place-items-center text-gray-900">
              <FiTarget className="w-6 h-6" />
            </div>
            <div className="leading-tight">
              <div className="text-xl font-semibold">NERDEE <span className="font-normal text-gray-500">×</span> Mi Empresa</div>
              <p className="text-sm text-gray-500">{t.auth.setNewPassword || 'Set your new password'}</p>
            </div>
          </div>
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {t.auth.backToLogin || 'Back to Login'}
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 mt-10 items-center">
          {/* Left highlight */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-sm">
              🔐 {t.auth.secureReset || 'Secure Reset'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
              {t.auth.resetPasswordTitle || 'Reset your password'}
            </h1>
            <p className="text-base text-gray-600">
              {t.auth.resetPasswordDescription || 'Enter your new password below. Make sure it\'s at least 8 characters long and secure.'}
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-xl shadow-black/10 backdrop-blur">
              {/* Success message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                  </div>
                </div>
              )}

              {!successMessage && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error message */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-3">
                      <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
                        {errorMessage.includes('expired') && (
                          <Link
                            to={ROUTES.FORGOT_PASSWORD}
                            className="text-xs text-red-600 underline mt-1 inline-block"
                          >
                            {t.auth.requestNewResetLink || 'Request a new reset link'}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* New Password field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.auth.newPassword || 'New Password'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiLock className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                        placeholder={t.auth.passwordPlaceholder || 'Enter new password'}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-xs text-red-600 font-medium">{errors.password}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      {t.auth.passwordRequirement || 'Minimum 8 characters'}
                    </p>
                  </div>

                  {/* Confirm Password field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.auth.confirmPassword || 'Confirm Password'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiLock className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                        placeholder={t.auth.confirmPasswordPlaceholder || 'Confirm new password'}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading || !token}
                    className="w-full bg-gradient-to-r from-[#6b7bff] to-[#7f64ff] hover:brightness-105 text-white rounded-full py-4 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_14px_30px_rgba(107,123,255,0.35)] mt-6"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      t.auth.resetPassword || 'Reset Password'
                    )}
                  </button>
                </form>
              )}

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 mt-6">
                <p>
                  {t.auth.rememberPassword || 'Remember your password?'}{' '}
                  <Link
                    to={ROUTES.LOGIN}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 underline decoration-indigo-200 hover:decoration-indigo-400 underline-offset-2"
                  >
                    {t.auth.signIn || 'Sign In'}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
