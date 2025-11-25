import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { FiMail, FiLock, FiAlertCircle, FiUser, FiBriefcase, FiGlobe } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateForm } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: '',
    language: 'es',
  });

  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setRegisterError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    // Validate form
    const validation = validateForm(formData, {
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
      name: { required: true, minLength: 2 },
      company: { required: true, minLength: 2 },
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: t.validation.passwordMatch }));
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name, formData.company, formData.language);
      navigate('/');
    } catch (error) {
      setRegisterError(error.message || t.errors.generic);
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
            {t.auth.createAccount}
          </p>
        </div>

        {/* Registration form */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-10 shadow-xl shadow-gray-900/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {registerError && (
              <div className="bg-red-50/80 border border-red-100 rounded-xl p-3.5 flex items-center gap-3">
                <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">{registerError}</p>
              </div>
            )}

            {/* Name field */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium"
                  placeholder={t.auth.name}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-xs text-red-600 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Company field */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiBriefcase className="h-4 w-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium"
                  placeholder={t.auth.company}
                />
              </div>
              {errors.company && (
                <p className="mt-2 text-xs text-red-600 font-medium">{errors.company}</p>
              )}
            </div>

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
                  autoComplete="new-password"
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

            {/* Confirm Password field */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-4 w-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm font-medium"
                  placeholder={t.auth.confirmPassword}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Language field */}
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiGlobe className="h-4 w-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 text-gray-900 text-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
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
                t.auth.createAccount
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          {t.auth.alreadyHaveAccount}{' '}
          <Link to="/login" className="font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 underline decoration-gray-300 hover:decoration-primary-600 underline-offset-2">
            {t.auth.signIn}
          </Link>
        </p>

        <div className="text-center text-sm text-gray-500 space-y-1">
          <p className="font-semibold text-gray-900">{t.auth.setupiqAltTitle}</p>
          <p>{t.auth.setupiqAltDescription}</p>
          <Link
            to={ROUTES.REGISTER_SETUPIQ}
            className="inline-flex items-center justify-center px-4 py-2 mt-1 text-xs font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
          >
            {t.auth.setupiqAltCta}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
