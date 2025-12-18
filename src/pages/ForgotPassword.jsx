import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiAlertCircle, FiCheckCircle, FiTarget, FiArrowLeft } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { validateForm } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import authService from '../services/authService';
import { useLanguage } from '../hooks/useLanguage';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Clear errors when user starts typing
    if (errors.email) {
      setErrors({});
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate email
    const validation = validateForm({ email }, {
      email: { required: true, email: true },
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
      setSuccessMessage(t.auth.passwordResetEmailSent || 'Password reset email sent successfully. Please check your inbox.');
      setEmail(''); // Clear form on success
    } catch (error) {
      // Handle rate limiting (429) and other errors
      if (error.status === 429) {
        setErrorMessage(t.auth.tooManyRequests || 'Too many requests. Please try again later.');
      } else {
        setErrorMessage(error.message || t.auth.emailNotFound || 'No account found with this email address');
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
              <p className="text-sm text-gray-500">{t.auth.resetYourPassword || 'Reset your password'}</p>
            </div>
          </div>
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
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
              {t.auth.forgotPasswordTitle || 'Forgot your password?'}
            </h1>
            <p className="text-base text-gray-600">
              {t.auth.forgotPasswordDescription || 'No problem! Enter your email address and we\'ll send you a link to reset your password.'}
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-xl shadow-black/10 backdrop-blur">
              {/* Success message */}
              {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                    <p className="text-xs text-green-700 mt-1">
                      {t.auth.checkEmailInbox || 'Check your email inbox and follow the link to reset your password.'}
                    </p>
                  </div>
                </div>
              )}

              {!successMessage && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error message */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-center gap-3">
                      <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
                    </div>
                  )}

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.auth.emailAddress || 'Email Address'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiMail className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                        placeholder={t.auth.emailPlaceholder || 'you@example.com'}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#6b7bff] to-[#7f64ff] hover:brightness-105 text-white rounded-full py-4 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_14px_30px_rgba(107,123,255,0.35)] mt-6"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      t.auth.sendResetLink || 'Send Reset Link'
                    )}
                  </button>
                </form>
              )}

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 mt-6 space-y-2">
                <p>
                  {t.auth.rememberPassword || 'Remember your password?'}{' '}
                  <Link
                    to={ROUTES.LOGIN}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 underline decoration-indigo-200 hover:decoration-indigo-400 underline-offset-2"
                  >
                    {t.auth.signIn || 'Sign In'}
                  </Link>
                </p>
                {!successMessage && (
                  <p className="text-xs text-gray-400 mt-4">
                    {t.auth.resetTokenExpiry || 'Reset links expire in 10 minutes for security.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
