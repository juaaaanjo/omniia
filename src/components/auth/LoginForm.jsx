import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateForm } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-lime-500 shadow-md shadow-green-400/30 grid place-items-center text-gray-900 font-bold text-lg">
              <span className="text-2xl leading-[0]">⌖</span>
            </div>
            <div className="leading-tight">
              <div className="text-xl font-semibold">NERDEE <span className="font-normal text-gray-500">×</span> Mi Empresa</div>
              <p className="text-sm text-gray-500">{t.auth.signInToDashboard}</p>
            </div>
          </div>
          <Link
            to={ROUTES.REGISTER_SETUPIQ}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {t.auth.signUp}
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 mt-10 items-center">
          {/* Left highlight */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-sm">
              🔒 Acceso seguro
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
              Ingresa a tu cuenta NERDEE
            </h1>
            <p className="text-base text-gray-600">
              Accede a tus paneles y datos de forma segura.
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-xl shadow-black/10 backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error message */}
                {loginError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-center gap-3">
                    <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{loginError}</p>
                  </div>
                )}

                {/* Email field */}
                <div>
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
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
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
                      <FiLock className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
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
              className="w-full bg-gradient-to-r from-[#6b7bff] to-[#7f64ff] hover:brightness-105 text-white rounded-full py-4 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_14px_30px_rgba(107,123,255,0.35)] mt-6"
            >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    t.auth.signIn
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-gray-500 mt-6">
                {t.auth.dontHaveAccount}{' '}
                <Link
                  to={ROUTES.REGISTER_SETUPIQ}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 underline decoration-indigo-200 hover:decoration-indigo-400 underline-offset-2"
                >
                  {t.auth.signUp}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
