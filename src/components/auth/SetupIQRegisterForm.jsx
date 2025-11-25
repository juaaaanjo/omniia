import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHotel, FaShoppingBag, FaUtensils, FaUsers, FaTools, FaCashRegister } from 'react-icons/fa';
import { FiHeart, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { MdStackedLineChart, MdOutlineCloudQueue, MdOutlinePayment, MdOutlineBarChart, MdPointOfSale } from 'react-icons/md';
import { RiWallet3Line, RiHome4Line, RiHome2Line, RiBarChartBoxLine, RiGroupLine, RiFocus2Line, RiShieldCheckFill } from 'react-icons/ri';
import smartRegisterService from '../../services/smartRegisterService';
import SelectionBlock from './SelectionBlock';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const industryOptions = ['Restaurante', 'Hotel', 'Retail', 'Otro'];
const objectiveOptions = [
  'Aumentar ventas',
  'Reducir gastos',
  'Mejorar atención al cliente',
  'Control total del negocio',
];
const subVerticalOptions = ['Boutique', 'Franquicia', 'Online', 'Híbrido', 'Otro'];
const systemStepOptions = ['Sistema POS', 'Contabilidad', 'CRM', 'Inventario', 'Cloud Storage', 'Pagos Online'];
const metricStepOptions = [
  'Ingresos totales',
  'Clientes activos',
  'Ticket promedio',
  'Satisfacción',
  'Eficiencia operativa',
  'Control de costos',
];
const guardrailStepOptions = ['Alertas de presupuesto', 'Stock mínimo', 'Metas de rendimiento', 'Cumplimiento normativo'];
const summaryCards = [
  { title: 'Tu Empresa', description: '1 tipo seleccionado\n1 objetivo', color: 'text-orange-400' },
  { title: 'Áreas y Equipos', description: 'Áreas y equipos configurados', color: 'text-blue-400' },
  { title: 'Conexiones', description: 'Sistemas conectados', color: 'text-emerald-400' },
  { title: 'Métricas', description: 'KPIs listos', color: 'text-indigo-400' },
  { title: 'Guardrails', description: 'Alertas configuradas', color: 'text-purple-400' },
];
const timezoneOptions = ['GMT-5', 'GMT-4', 'GMT-3', 'GMT-6', 'GMT-7', 'GMT-8'];
const currencyOptions = ['USD', 'EUR', 'COP', 'MXN', 'CLP', 'ARS'];
const countryOptions = ['Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Estados Unidos'];
const cityOptions = ['Bogotá', 'CDMX', 'Buenos Aires', 'Santiago', 'Lima', 'Miami'];
const industryMeta = {
  Restaurante: { color: '#f97316', Icon: FaUtensils, iconBg: '#1c120d' },
  Hotel: { color: '#3b82f6', Icon: FaHotel, iconBg: '#0f172a' },
  Retail: { color: '#22c55e', Icon: FaShoppingBag, iconBg: '#0f1a12' },
  Otro: { color: '#a855f7', Icon: HiOutlineSparkles, iconBg: '#1a0f23' },
};
const objectiveMeta = {
  'Aumentar ventas': { color: '#22c55e', Icon: FiTrendingUp, iconBg: '#0f1a12' },
  'Reducir gastos': { color: '#fb923c', Icon: RiWallet3Line, iconBg: '#1c120d' },
  'Mejorar atención al cliente': { color: '#f472b6', Icon: FiHeart, iconBg: '#1a1016' },
  'Control total del negocio': { color: '#6366f1', Icon: MdStackedLineChart, iconBg: '#131526' },
};
const areaMeta = {
  Cocina: { color: '#f97316', Icon: FaUtensils, iconBg: '#1c120d' },
  Servicio: { color: '#3b82f6', Icon: FaUsers, iconBg: '#0f172a' },
  Administración: { color: '#22c55e', Icon: RiHome4Line, iconBg: '#0f1a12' },
  Mantenimiento: { color: '#f59e0b', Icon: FaTools, iconBg: '#1c120d' },
};
const teamMeta = {
  Chefs: { color: '#f97316', Icon: FaUtensils, iconBg: '#1c120d' },
  Meseros: { color: '#3b82f6', Icon: FaUsers, iconBg: '#0f172a' },
  Gerentes: { color: '#22c55e', Icon: RiHome4Line, iconBg: '#0f1a12' },
  Limpieza: { color: '#a855f7', Icon: RiHome2Line, iconBg: '#1a0f23' },
};
const systemMeta = {
  'Sistema POS': { color: '#38bdf8', Icon: MdPointOfSale, iconBg: '#0f1624' },
  Contabilidad: { color: '#2563eb', Icon: FaCashRegister, iconBg: '#0f172a' },
  CRM: { color: '#ef4444', Icon: FaUsers, iconBg: '#1a0f12' },
  Inventario: { color: '#fb923c', Icon: MdOutlineBarChart, iconBg: '#1c120d' },
  'Cloud Storage': { color: '#8b5cf6', Icon: MdOutlineCloudQueue, iconBg: '#1a0f23' },
  'Pagos Online': { color: '#6366f1', Icon: MdOutlinePayment, iconBg: '#131526' },
};
const metricMeta = {
  'Ingresos totales': { color: '#22c55e', Icon: RiBarChartBoxLine, iconBg: '#0f1a12' },
  'Clientes activos': { color: '#2563eb', Icon: RiGroupLine, iconBg: '#0f172a' },
  'Ticket promedio': { color: '#f59e0b', Icon: RiWallet3Line, iconBg: '#1c120d' },
  Satisfacción: { color: '#f43f5e', Icon: FiHeart, iconBg: '#1a1016' },
  'Eficiencia operativa': { color: '#6366f1', Icon: RiFocus2Line, iconBg: '#131526' },
  'Control de costos': { color: '#a855f7', Icon: MdStackedLineChart, iconBg: '#1a0f23' },
};
const guardrailMeta = {
  'Alertas de presupuesto': { color: '#f59e0b', Icon: MdOutlinePayment, iconBg: '#1c120d' },
  'Stock mínimo': { color: '#f43f5e', Icon: MdOutlineBarChart, iconBg: '#1a1016' },
  'Metas de rendimiento': { color: '#22c55e', Icon: FiTrendingUp, iconBg: '#0f1a12' },
  'Cumplimiento normativo': { color: '#6366f1', Icon: RiShieldCheckFill, iconBg: '#131526' },
};

const initialForm = {
  industry: '',
  subVertical: '',
  objective: '',
  foundationYear: '',
  employeeCount: '',
  businessName: '',
  taxId: '',
  country: '',
  city: '',
  timezone: '',
  currency: '',
  areasMonitored: [],
  teams: [],
  systems: [],
  metrics: [],
  alerts: [],
};

const SetupIQRegisterForm = ({ currentStep = 1, onStepChange, theme = 'dark' }) => {
  const isLight = theme === 'light';
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const [finishEmail, setFinishEmail] = useState('');
  const [finishPassword, setFinishPassword] = useState('');
  const [finishName, setFinishName] = useState('');
  const [finishError, setFinishError] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const toggleMulti = (field, value) => {
    setForm((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(value);
      const next = exists ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = useCallback(() => {
    if (
      !form.industry ||
      !form.objective ||
      !form.foundationYear ||
      !form.employeeCount ||
      !form.businessName ||
      !form.taxId ||
      !form.country ||
      !form.city ||
      !form.timezone ||
      !form.currency
    ) {
      return 'Por favor completa todos los campos obligatorios.';
    }
    return null;
  }, [form]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    // Move to next step if not final
    if (currentStep === 1 && onStepChange) {
      onStepChange(2);
      return;
    }
    if (currentStep === 2 && onStepChange) {
      onStepChange(3);
      return;
    }
    if (currentStep === 3 && onStepChange) {
      onStepChange(4);
      return;
    }
    if (currentStep === 4 && onStepChange) {
      onStepChange(5);
      return;
    }
    if (currentStep === 5 && onStepChange) {
      onStepChange(6);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        foundationYear: form.foundationYear,
        employeeCount: form.employeeCount,
        subVertical: form.subVertical || '',
        areasMonitored: form.areasMonitored?.length ? form.areasMonitored : ['General'],
        teams: form.teams?.length ? form.teams : ['General'],
        systems: form.systems?.length ? form.systems : ['General'],
        metrics: form.metrics?.length ? form.metrics : ['General'],
        alerts: form.alerts?.length ? form.alerts : ['General'],
      };
      const result = await smartRegisterService.submitForm(payload);
      setSubmitResult(result);
      if (onStepChange) onStepChange(3);
    } catch (err) {
      if (err.status === 400) {
        setError(err.message || 'Faltan datos. Revisa los campos.');
      } else {
        setError(err.message || 'No pudimos enviar el formulario. Intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async (e) => {
    e?.preventDefault();
    if (!submitResult?.sessionId) {
      setFinishError('Falta sessionId para finalizar.');
      return;
    }
    if (!finishEmail || !finishPassword) {
      setFinishError('Correo y contraseña son obligatorios.');
      return;
    }
    if (finishPassword.length < 8) {
      setFinishError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setFinishError('');
    setIsFinishing(true);
    try {
      const response = await smartRegisterService.finishSession(submitResult.sessionId, {
        email: finishEmail,
        password: finishPassword,
        name: finishName || undefined,
      });
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (token && refreshUser) {
        try {
          await refreshUser();
        } catch (errRefresh) {
          console.warn('No se pudo refrescar el usuario:', errRefresh);
        }
      }
      setShowFinishModal(true);
    } catch (err) {
      if (err.status === 409) {
        setFinishError('Este correo ya existe. Usa la contraseña correcta o cambia de correo.');
      } else if (err?.data?.errors?.length) {
        // Surface specific validation errors from the API response
        const apiErrors = err.data.errors
          .map((e) => e?.message || e?.field)
          .filter(Boolean)
          .join(' ');
        setFinishError(apiErrors || err.message || 'No pudimos crear las credenciales. Intenta de nuevo.');
      } else {
        setFinishError(err.message || 'No pudimos crear las credenciales. Intenta de nuevo.');
      }
    } finally {
      setIsFinishing(false);
    }
  };

  const isCompleted = useMemo(() => !!submitResult?.completed, [submitResult]);
  const inputBase = isLight
    ? 'w-full h-14 bg-white border border-gray-200 text-gray-900 rounded-2xl px-4 text-base placeholder:text-gray-500 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors shadow-sm'
    : 'w-full h-14 bg-[#13141b] border border-[#2d2f3b] text-white rounded-2xl px-4 text-base placeholder:text-gray-500 focus:ring-2 focus:ring-white/12 focus:border-white/35 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]';
  const labelClass = isLight ? 'text-base font-semibold text-gray-700' : 'text-base font-semibold text-gray-300';
  const finishInputClass = isLight
    ? 'w-full h-12 bg-white border border-gray-200 text-gray-900 rounded-xl px-4 text-sm placeholder:text-gray-500 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors'
    : 'w-full h-12 bg-[#11121a] border border-[#2d2f3b] text-white rounded-xl px-4 text-sm placeholder:text-gray-500 focus:ring-2 focus:ring-white/10 focus:border-white/30 transition-colors';

  // Final credentials view once the flow is completed
  if (isCompleted) {
    return (
      <div className={`p-0 lg:p-2 ${isLight ? 'bg-white text-gray-900' : 'bg-[#0b0c10] text-white'}`}>
        {showFinishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div
              className={`rounded-3xl p-6 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.45)] space-y-4 border ${
                isLight
                  ? 'bg-white border-gray-200 text-gray-900 shadow-[0_18px_35px_rgba(15,23,42,0.08)]'
                  : 'bg-[#0f1016] border-[#1f2027] text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">¡Listo! 🚀</div>
                <button
                  type="button"
                  onClick={() => {
                    setShowFinishModal(false);
                    navigate(ROUTES.DASHBOARD);
                  }}
                  className={`${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
                >
                  ✕
                </button>
              </div>
              <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                Tus credenciales se crearon correctamente. Entra a tu cuenta para continuar.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFinishModal(false);
                    navigate(ROUTES.REGISTER_SETUPIQ);
                  }}
                  className="w-full bg-gradient-to-r from-[#5b7bff] to-[#7a5fff] text-white rounded-xl py-3 text-sm font-semibold hover:from-[#6f8cff] hover:to-[#8a6bff] transition-all shadow-[0_12px_30px_rgba(91,123,255,0.35)]"
                >
                  Registrarse
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFinishModal(false);
                    navigate(ROUTES.LOGIN);
                  }}
                  className="w-full border border-[#2d2f3b] text-white rounded-xl py-3 text-sm font-semibold bg-[#14151c] hover:border-gray-500 transition-colors"
                >
                  Ir a iniciar sesión
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          <div className={`text-center space-y-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
            <h3 className="text-4xl sm:text-5xl font-bold">¡Listo! 🚀</h3>
            <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>Crea tu acceso para entrar de inmediato</p>
          </div>

          <div
            className={`rounded-3xl p-6 shadow-[0_16px_35px_rgba(0,0,0,0.35)] border ${
              isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#0f1016] border-[#1f2027] text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>Crea tu acceso con este registro</p>
                <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                  Usa correo y contraseña para entrar de inmediato. Si el correo existe, ingresa la contraseña correcta o cambia el correo.
                </p>
              </div>
              <span className={`${isLight ? 'text-emerald-600' : 'text-emerald-400'} text-sm font-semibold`}>Final</span>
            </div>
            <form onSubmit={handleFinish} className="grid md:grid-cols-3 gap-3">
              <input
                type="email"
                value={finishEmail}
                onChange={(e) => setFinishEmail(e.target.value)}
                placeholder="Correo electrónico"
                className={finishInputClass}
              />
              <input
                type="password"
                value={finishPassword}
                onChange={(e) => setFinishPassword(e.target.value)}
                placeholder="Contraseña"
                className={finishInputClass}
              />
              <input
                type="text"
                value={finishName}
                onChange={(e) => setFinishName(e.target.value)}
                placeholder="Nombre (opcional)"
                className={finishInputClass}
              />
              {finishError && (
                <div className="md:col-span-3 text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                  {finishError}
                </div>
              )}
              <div className="md:col-span-3 flex flex-col md:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isFinishing}
                  className="flex-1 bg-gradient-to-r from-[#5b7bff] to-[#7a5fff] text-white rounded-xl py-3 text-sm font-semibold hover:from-[#6f8cff] hover:to-[#8a6bff] transition-all disabled:opacity-60 shadow-[0_12px_30px_rgba(91,123,255,0.35)]"
                >
                  {isFinishing ? 'Creando acceso...' : 'Crear acceso y continuar'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="flex-1 border border-[#2d2f3b] text-white rounded-xl py-3 text-sm font-semibold bg-[#14151c] hover:border-gray-500 transition-colors"
                >
                  Ir a iniciar sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const renderCount = (selected, multi) => {
    const count = multi ? selected.length : selected ? 1 : 0;
    return (
      <div className="text-xs text-emerald-300 flex items-center gap-1 font-semibold">
        {count} seleccionado{count !== 1 ? 's' : ''} <span className="w-2 h-2 bg-emerald-400 rounded-full" />
      </div>
    );
  };

  return (
    <div className={`p-0 lg:p-2 ${isLight ? 'bg-white text-gray-900' : 'bg-[#0b0c10] text-white'}`}>
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <h2 className={`text-4xl sm:text-5xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Hi{' '}
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${
                    isLight ? 'from-orange-500 via-purple-500 to-emerald-500' : 'from-orange-400 via-purple-400 to-emerald-300'
                  }`}
                >
                  NERDEE
                </span>{' '}
                <span role="img" aria-label="wave">👋</span>
              </h2>
              <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>Cuéntanos sobre tu empresa</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <SelectionBlock
                title="¿A qué se dedica tu empresa?"
                options={industryOptions}
                selected={form.industry}
                onSelect={(val) => setField('industry', val)}
                countLabel
                countAlign="right"
                optionMeta={industryMeta}
                columns={4}
                theme={theme}
              />
              <SelectionBlock
                title="¿Qué te gustaría lograr?"
                options={objectiveOptions}
                selected={form.objective}
                onSelect={(val) => setField('objective', val)}
                countLabel
                countAlign="right"
                optionMeta={objectiveMeta}
                columns={4}
                theme={theme}
              />
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <label className={labelClass}>Sector</label>
                <select
                  value={form.industry}
                  onChange={(e) => setField('industry', e.target.value)}
                  className={`${inputBase} appearance-none`}
                >
                  <option value="">Seleccionar</option>
                  {industryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Sub-vertical</label>
                <select
                  value={form.subVertical}
                  onChange={(e) => setField('subVertical', e.target.value)}
                  className={`${inputBase} appearance-none`}
                >
                  <option value="">Seleccionar</option>
                  {subVerticalOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Fundación</label>
                <input
                  type="number"
                  value={form.foundationYear}
                  onChange={(e) => setField('foundationYear', e.target.value)}
                  className={inputBase}
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Empleados</label>
                <input
                  type="number"
                  value={form.employeeCount}
                  onChange={(e) => setField('employeeCount', e.target.value)}
                  className={inputBase}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Nombre legal</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setField('businessName', e.target.value)}
                  className={inputBase}
                  placeholder="Mi Empresa S.A."
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>NIT / EIN</label>
                <input
                  type="text"
                  value={form.taxId}
                  onChange={(e) => setField('taxId', e.target.value)}
                  className={inputBase}
                  placeholder="123456789"
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>País</label>
                <select
                  value={form.country}
                  onChange={(e) => setField('country', e.target.value)}
                  className={`${inputBase} appearance-none`}
                >
                  <option value="">Seleccionar</option>
                  {countryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Ciudad</label>
                <select
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  className={`${inputBase} appearance-none`}
                >
                  <option value="">Seleccionar</option>
                  {cityOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Huso horario</label>
                <select
                  value={form.timezone}
                  onChange={(e) => setField('timezone', e.target.value)}
                  className={`${inputBase} appearance-none`}
                >
                  <option value="">Seleccionar</option>
                  {timezoneOptions.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Moneda base</label>
                <select
                  value={form.currency}
                  onChange={(e) => setField('currency', e.target.value)}
                  className={`${inputBase} appearance-none`}
                >
                  <option value="">Seleccionar</option>
                  {currencyOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className={`text-4xl sm:text-5xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Organiza tus{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-300">
                  Áreas
                </span>{' '}
                📊
              </h2>
              <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>Define las áreas operativas de tu empresa</p>
            </div>

            <SelectionBlock
              title="¿Qué áreas quieres monitorear?"
              options={['Cocina', 'Servicio', 'Administración', 'Mantenimiento']}
              selected={form.areasMonitored}
              onSelect={(val) => toggleMulti('areasMonitored', val)}
              multi
              countLabel
              countAlign="left"
              optionMeta={areaMeta}
              columns={4}
              theme={theme}
            />
            <SelectionBlock
              title="¿Qué equipos tienes?"
              options={['Chefs', 'Meseros', 'Gerentes', 'Limpieza']}
              selected={form.teams}
              onSelect={(val) => toggleMulti('teams', val)}
              multi
              countLabel
              countAlign="left"
              optionMeta={teamMeta}
              columns={4}
              theme={theme}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className={`text-4xl sm:text-5xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Conecta tus{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-400">
                  Sistemas
                </span>{' '}
                🔌
              </h2>
              <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>Integra las herramientas que ya usas</p>
            </div>

            <SelectionBlock
              title="¿Qué sistemas quieres conectar?"
              options={systemStepOptions}
              selected={form.systems}
              onSelect={(val) => toggleMulti('systems', val)}
              multi
              countLabel
              countAlign="right"
              optionMeta={systemMeta}
              columns={3}
              theme={theme}
            />
            <div
              className={`rounded-2xl p-5 text-sm flex items-center gap-3 shadow-[0_18px_40px_rgba(0,0,0,0.15)] border ${
                isLight
                  ? 'bg-blue-50 border-blue-100 text-blue-900'
                  : 'bg-gradient-to-r from-[#0b1624] via-[#0c1a2d] to-[#0b1624] border-[#1f3650] text-gray-200'
              }`}
            >
              <span className={`text-xl ${isLight ? 'text-blue-500' : 'text-blue-300'}`}>🔌</span>
              <div>
                <div className={`text-base font-semibold ${isLight ? 'text-blue-900' : 'text-white'}`}>Integración automática</div>
                <p className={`text-sm ${isLight ? 'text-blue-800' : 'text-gray-300'}`}>
                  NERDEE se conectará automáticamente con tus sistemas y comenzará a sincronizar datos de forma segura.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className={`text-4xl sm:text-5xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Define tus{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-rose-400 to-red-500">
                  Métricas
                </span>{' '}
                📈
              </h2>
              <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>Elige los KPIs que quieres monitorear</p>
            </div>

            <SelectionBlock
              title="¿Qué métricas son importantes para ti?"
              options={metricStepOptions}
              selected={form.metrics}
              onSelect={(val) => toggleMulti('metrics', val)}
              multi
              countLabel
              countAlign="right"
              optionMeta={metricMeta}
              columns={3}
              theme={theme}
            />
            <div
              className={`rounded-2xl p-5 text-sm flex items-center gap-3 shadow-[0_18px_40px_rgba(0,0,0,0.15)] border ${
                isLight
                  ? 'bg-amber-50 border-amber-100 text-amber-900'
                  : 'bg-gradient-to-r from-[#241207] via-[#1f150b] to-[#241207] border-[#3b2416] text-gray-200'
              }`}
            >
              <span className={`text-xl ${isLight ? 'text-amber-500' : 'text-amber-400'}`}>📊</span>
              <div>
                <div className={`text-base font-semibold ${isLight ? 'text-amber-900' : 'text-white'}`}>Dashboard personalizado</div>
                <p className={`text-sm ${isLight ? 'text-amber-800' : 'text-gray-300'}`}>
                  Configuramos tus KPIs y podrás editarlos en cualquier momento.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className={`text-4xl sm:text-5xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Configura{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-500">
                  Guardrails
                </span>{' '}
                🛡️
              </h2>
              <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>Establece límites y alertas automáticas</p>
            </div>

            <SelectionBlock
              title="¿Qué alertas quieres recibir?"
              options={guardrailStepOptions}
              selected={form.alerts}
              onSelect={(val) => toggleMulti('alerts', val)}
              multi
              countLabel
              countAlign="right"
              optionMeta={guardrailMeta}
              columns={4}
              theme={theme}
            />
            <div
              className={`rounded-2xl p-5 text-sm flex items-center gap-3 shadow-[0_18px_40px_rgba(0,0,0,0.15)] border ${
                isLight
                  ? 'bg-indigo-50 border-indigo-100 text-indigo-900'
                  : 'bg-gradient-to-r from-[#0f1024] via-[#11112c] to-[#0f1024] border-[#1f2040] text-gray-200'
              }`}
            >
              <span className={`text-xl ${isLight ? 'text-indigo-500' : 'text-indigo-300'}`}>🛡️</span>
              <div>
                <div className={`text-base font-semibold ${isLight ? 'text-indigo-900' : 'text-white'}`}>Protección inteligente</div>
                <p className={`text-sm ${isLight ? 'text-indigo-800' : 'text-gray-300'}`}>
                  NERDEE te notificará automáticamente cuando se detecten anomalías o se alcancen los límites establecidos.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-8">
            <div className={`text-center space-y-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              <h3 className="text-4xl sm:text-5xl font-bold">
                ¡Listo para el{' '}
                <span className={isLight ? 'text-green-500' : 'text-green-400'}>
                  Dry-run
                </span>
                ! 🚀
              </h3>
              <p className={`text-lg ${isLight ? 'text-gray-500' : 'text-gray-200'}`}>Revisa tu configuración antes de comenzar</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {summaryCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-[26px] p-5 border ${
                    isLight
                      ? 'bg-white text-gray-900 border-gray-200 shadow-[0_16px_32px_rgba(15,23,42,0.08)]'
                      : 'bg-[#0f1016] text-gray-50 border-[#1f2027] shadow-[0_20px_35px_rgba(0,0,0,0.35)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg ${card.color}`}
                      style={{
                        background: isLight ? '#f5f7fb' : 'rgba(255,255,255,0.05)',
                        border: isLight ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      ⌖
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>{card.title}</div>
                      <div className={`text-sm whitespace-pre-line ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>{card.description}</div>
                    </div>
                  </div>
                  <div className={`text-sm mt-3 flex items-center gap-2 font-semibold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
                    ✓ Completado
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`rounded-[28px] p-6 text-center shadow-[0_18px_40px_rgba(0,0,0,0.15)] ${
                isLight
                  ? 'bg-gradient-to-r from-[#7ce5a7] via-[#9ef3c0] to-[#7ce5a7] text-gray-900'
                  : 'bg-gradient-to-r from-[#3ccf73] via-[#5de68a] to-[#3ccf73] text-gray-900'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white/80 text-gray-900 flex items-center justify-center text-2xl mx-auto mb-2">
                ▶
              </div>
              <div className="text-xl font-semibold">Todo está listo</div>
              <p className="text-sm mt-1 text-gray-800">
                NERDEE está configurado y listo para comenzar a analizar tu empresa.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div
          className={`mt-4 rounded-2xl px-4 py-4 flex flex-wrap items-center gap-4 justify-between border ${
            isLight
              ? 'bg-white/90 border-gray-200 text-gray-900 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur'
              : 'bg-[#0d0e12] border-white/5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
          }`}
        >
          <div className="flex items-center gap-3">
            {currentStep > 1 && !isCompleted && (
              <button
                type="button"
                onClick={() => onStepChange && onStepChange(currentStep - 1)}
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border transition-all ${
                  isLight
                    ? 'bg-white border-gray-300 text-gray-900 shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:border-gray-400'
                    : 'bg-[#14151c] border-[#272933] text-white hover:border-gray-500'
                }`}
              >
                ← Atrás
              </button>
            )}
            <div className={`text-sm flex items-center gap-2 ${isLight ? 'text-gray-500' : 'text-gray-200'}`}>
              <span role="img" aria-label="sparkles">✨</span>
              {isCompleted ? '¡Has completado todos los pasos!' : `Paso ${currentStep} de 6`}
            </div>
          </div>
          {!isCompleted ? (
            <div className="flex items-center gap-3">
              <div
                className={`text-xs flex items-center gap-2 px-3 py-2 rounded-full border ${
                  isLight
                    ? 'text-amber-600 bg-amber-50 border-amber-200'
                    : 'text-amber-200 bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <span role="img" aria-label="hint">💡</span> Puedes seleccionar múltiples opciones
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all disabled:opacity-60 ${
                  isLight
                    ? 'text-white bg-gradient-to-r from-[#6b7bff] to-[#7f64ff] shadow-[0_12px_30px_rgba(107,123,255,0.35)] hover:brightness-105'
                    : 'text-white bg-gradient-to-r from-[#5b7bff] to-[#7a5fff] hover:from-[#6f8cff] hover:to-[#8a6bff] shadow-[0_12px_30px_rgba(91,123,255,0.35)]'
                }`}
              >
                {isSubmitting ? 'Enviando...' : currentStep >= 6 ? 'Enviar' : 'Siguiente'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-3 py-2 rounded-full border ${
                  isLight
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                Enviado correctamente
              </span>
            </div>
          )}
        </div>
      </form>

      {isCompleted && (
        <div
          className={`mt-6 rounded-3xl p-6 shadow-[0_16px_35px_rgba(0,0,0,0.35)] border ${
            isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#0f1016] border-[#1f2027] text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>Crea tu acceso con este registro</p>
              <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                Usa correo y contraseña para entrar de inmediato. Si el correo existe, ingresa la contraseña correcta o cambia el correo.
              </p>
            </div>
            <span className={`${isLight ? 'text-emerald-600' : 'text-emerald-400'} text-sm font-semibold`}>Final</span>
          </div>
          <form onSubmit={handleFinish} className="grid md:grid-cols-3 gap-3">
            <input
              type="email"
              value={finishEmail}
              onChange={(e) => setFinishEmail(e.target.value)}
              placeholder="Correo electrónico"
              className={finishInputClass}
            />
            <input
              type="password"
              value={finishPassword}
              onChange={(e) => setFinishPassword(e.target.value)}
              placeholder="Contraseña"
              className={finishInputClass}
            />
            <input
              type="text"
              value={finishName}
              onChange={(e) => setFinishName(e.target.value)}
              placeholder="Nombre (opcional)"
              className={finishInputClass}
            />
            {finishError && (
              <div className="md:col-span-3 text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                {finishError}
              </div>
            )}
            <div className="md:col-span-3 flex flex-col md:flex-row gap-3">
              <button
                type="submit"
                disabled={isFinishing}
                className="flex-1 bg-gradient-to-r from-[#5b7bff] to-[#7a5fff] text-white rounded-xl py-3 text-sm font-semibold hover:from-[#6f8cff] hover:to-[#8a6bff] transition-all disabled:opacity-60 shadow-[0_12px_30px_rgba(91,123,255,0.35)]"
              >
                {isFinishing ? 'Creando acceso...' : 'Crear acceso y continuar'}
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="flex-1 border border-[#2d2f3b] text-white rounded-xl py-3 text-sm font-semibold bg-[#14151c] hover:border-gray-500 transition-colors"
              >
                Ir a iniciar sesión
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SetupIQRegisterForm;
