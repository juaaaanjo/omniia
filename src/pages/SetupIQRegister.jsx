import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import SetupIQRegisterForm from '../components/auth/SetupIQRegisterForm';
import { useLanguage } from '../hooks/useLanguage';
import { ROUTES } from '../utils/constants';

const SetupIQRegister = () => {
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);

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

  return (
    <div className="min-h-screen bg-[#05060a] text-white relative overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top_left,#1c9cf0,transparent_35%),radial-gradient(circle_at_bottom_right,#7b4bff,transparent_35%)]" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute right-10 top-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute right-24 bottom-8 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-14 space-y-6">
        {/* Top nav */}
        <div className="flex items-center justify-between bg-[#121317]/80 border border-white/10 rounded-2xl px-4 py-3 shadow-lg shadow-black/30 backdrop-blur animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-lime-500 shadow-lg shadow-green-500/40 flex items-center justify-center text-gray-900 font-bold text-lg">
              <span className="text-2xl leading-none">⌖</span>
            </div>
            <div className="text-lg font-semibold tracking-tight">
              NERDEE <span className="font-normal text-gray-200">×</span> Mi Empresa
            </div>
          </div>

          <div className="flex items-center gap-6 overflow-x-visible px-2">
            {steps.map((step, idx) => {
              const isCurrent = step.status === 'current';
              const isDone = step.status === 'done';
              const isUpcoming = step.status === 'upcoming';
              const circleStyle = {
                borderColor: step.color,
                color: step.color,
                backgroundColor: isDone ? `${step.color}22` : isCurrent ? `${step.color}12` : '#0b0c10',
                boxShadow: isDone || isCurrent ? `0 0 14px ${step.color}55` : '0 0 0 transparent',
                opacity: isUpcoming ? 0.7 : 1,
              };
              const lineStyle = {
                backgroundColor: step.color,
                boxShadow: `0 0 10px ${step.color}55`,
                opacity: isUpcoming ? 0.45 : 0.9,
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
          </div>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] shadow-2xl shadow-black/30 backdrop-blur-xl overflow-hidden animate-fade-up">
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="relative bg-white text-gray-900 rounded-2xl shadow-2xl shadow-gray-900/20 border border-white/10 overflow-hidden">
                <SetupIQRegisterForm currentStep={currentStep} onStepChange={setCurrentStep} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupIQRegister;
