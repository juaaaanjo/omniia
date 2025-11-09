import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateForm } from '../../utils/validators';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const loginAttemptRef = useRef(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // Navigate to dashboard after successful authentication
  useEffect(() => {
    if (isAuthenticated && !isLoading && loginAttemptRef.current) {
      // Small delay to ensure auth state is fully propagated
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    // Validate form
    const validation = validateForm(formData, {
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      loginAttemptRef.current = true;
      await login(formData.email, formData.password);
      // Navigation now handled by useEffect to ensure auth state is fully propagated
    } catch (error) {
      loginAttemptRef.current = false;
      setLoginError(error.message || t.auth.invalidCredentials);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-12">
      <div className="max-w-[420px] w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
            Nerdee
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {t.auth.signInToDashboard}
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-10 shadow-xl shadow-gray-900/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {loginError && (
              <div className="bg-red-50/80 border border-red-100 rounded-xl p-3.5 flex items-center gap-3">
                <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">{loginError}</p>
              </div>
            )}

            {/* Email field */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-4 w-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium"
                  placeholder={t.auth.emailPlaceholder}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-4 w-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium"
                  placeholder={t.auth.passwordPlaceholder}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <a
                href="#"
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {t.auth.forgotPassword}
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-4 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 mt-8"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                t.auth.signIn
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          {t.auth.dontHaveAccount}{' '}
          <Link to="/register" className="font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 underline decoration-gray-300 hover:decoration-primary-600 underline-offset-2">
            {t.auth.signUp}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
