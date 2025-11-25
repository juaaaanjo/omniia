import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { FiTarget } from 'react-icons/fi';
import SetupIQRegisterForm from '../components/auth/SetupIQRegisterForm';
import { useLanguage } from '../hooks/useLanguage';
import { ROUTES } from '../utils/constants';

const SetupIQRegister = () => {
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [theme, setTheme] = useState('light');
  const isLight = theme === 'light';

  const stepPalette = useMemo(
    () => [
      { label: 'Empresa', color: '#ff8b4c' },
      { label: 'Áreas', color: '#4f8bff' },
      { label: 'Conexiones', color: '#30c176' },
      { label: 'Métricas', color: '#6a6ffb' },
      { label: 'Guardrails', color: '#f4a23a' },
      { label: 'Dry-run', color: '#b074ff' },
    ],
    []
  );

  const steps = useMemo(
    () =>
      stepPalette.map((step, idx) => ({
        ...step,
        status: idx + 1 === currentStep ? 'current' : idx + 1 < currentStep ? 'done' : 'upcoming',
      })),
    [currentStep, stepPalette]
  );

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div
      className={`min-h-screen ${
        isLight ? 'bg-white text-gray-900' : 'bg-black text-white'
      } relative overflow-x-hidden transition-colors`}
    >

      <div className="sticky top-0 z-50 px-6 pt-2">
        <div className="max-w-screen-2xl mx-auto">
          <div
            className={`flex items-center justify-between rounded-2xl px-5 py-4 md:py-5 shadow-lg shadow-black/30 backdrop-blur animate-fade-up ${
              isLight ? 'bg-white/90 border border-gray-200' : 'bg-[#121317]/80 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-lime-500 shadow-lg shadow-green-500/40 grid place-items-center text-gray-900 font-bold text-lg">
                <FiTarget className="w-6 h-6" />
              </div>
              <div className="text-lg font-semibold tracking-tight">
                NERDEE <span className={`font-normal ${isLight ? 'text-gray-500' : 'text-gray-200'}`}>×</span> Mi Empresa
              </div>
            </div>

            <div className="flex items-center gap-6 overflow-x-visible px-2">
              {steps.map((step, idx) => {
                const isCurrent = step.status === 'current';
                const isDone = step.status === 'done';
                const isUpcoming = step.status === 'upcoming';
                const baseCircleBg = isLight ? '#f5f7fb' : '#0b0c10';
                const circleStyle = {
                  borderColor: step.color,
                  color: step.color,
                  backgroundColor: isDone
                    ? `${step.color}12`
                    : isCurrent
                      ? `${step.color}10`
                      : baseCircleBg,
                  boxShadow: isDone || isCurrent ? `0 0 14px ${step.color}55` : '0 0 0 transparent',
                  opacity: isUpcoming ? (isLight ? 0.8 : 0.7) : 1,
                };
                const lineStyle = {
                  backgroundColor: isUpcoming ? (isLight ? '#e5e7eb' : '#1f2027') : step.color,
                  boxShadow: isUpcoming ? '0 0 0 transparent' : `0 0 10px ${step.color}55`,
                  opacity: isUpcoming ? (isLight ? 0.5 : 0.45) : 0.9,
                };

                return (
                  <div key={step.label} className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2 min-w-[78px]">
                      <div
                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-base font-semibold transition-all duration-200"
                        style={circleStyle}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span
                        className="text-xs font-semibold tracking-tight"
                        style={{ color: step.color, opacity: isUpcoming ? 0.85 : 1 }}
                      >
                        {step.label}
                      </span>
                    </div>
                    {idx < steps.length - 1 && <div className="w-12 h-[3px] rounded-full" style={lineStyle} />}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={toggleTheme}
                className={`ml-4 w-12 h-6 rounded-full border flex items-center transition-all duration-200 ${
                  isLight ? 'bg-amber-100 border-amber-200' : 'bg-[#1b1c22] border-[#2a2c35]'
                }`}
                aria-label="Toggle color mode"
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all duration-200 grid place-items-center text-xs ${
                    isLight ? 'translate-x-[26px] text-amber-500' : 'translate-x-[2px] text-blue-200'
                  }`}
                >
                  {isLight ? '☀️' : '🌙'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-6 pb-14 pt-2 space-y-6">
        <div
          className={`rounded-[32px] shadow-2xl shadow-black/30 backdrop-blur-xl overflow-hidden animate-fade-up ${
            isLight ? 'bg-white' : 'bg-[#0a0a0a]'
          }`}
        >
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className={`relative ${isLight ? 'text-gray-900' : 'text-white'}`}>
                <SetupIQRegisterForm currentStep={currentStep} onStepChange={setCurrentStep} theme={theme} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupIQRegister;
