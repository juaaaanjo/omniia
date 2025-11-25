const SelectionBlock = ({
  title,
  options,
  selected,
  onSelect,
  multi = false,
  countLabel = false,
  countAlign = 'right',
  optionMeta = {},
  columns = 2,
}) => {
  const count = multi ? selected.length : selected ? 1 : 0;
  const CountBadge = () =>
    countLabel ? (
      <div className="text-xs text-emerald-300 flex items-center gap-1 font-semibold">
        {count} seleccionado{count !== 1 ? 's' : ''}
        <span className="w-2 h-2 bg-emerald-400 rounded-full" />
      </div>
    ) : null;

  return (
    <div className="bg-[#0b0c10] border border-[#1c1d25] rounded-3xl p-5 space-y-3 shadow-inner shadow-black/40">
      <div
        className={`flex items-center ${countAlign === 'right' ? 'justify-between' : 'justify-start gap-3'}`}
      >
        <p className="text-sm font-semibold text-gray-200">{title}</p>
        <CountBadge />
      </div>
      <div
        className={`grid gap-4 ${columns === 1 ? 'grid-cols-1' : ''}`}
        style={columns !== 1 ? { gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` } : undefined}
      >
        {options.map((opt) => {
          const active = multi ? selected.includes(opt) : selected === opt;
          const meta = optionMeta[opt] || {};
          const Icon = meta.Icon;
          const color = meta.color || '#4ade80';
          const iconBg = meta.iconBg || '#14151c';

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className="group w-full px-5 py-4 rounded-[24px] text-left text-base font-semibold flex items-center justify-between gap-4 border transition-all duration-200"
              style={{
                borderColor: active ? color : '#1f2027',
                background: active ? 'linear-gradient(145deg, #0f1016, #0c0d12)' : '#101118',
                boxShadow: active
                  ? `0 12px 32px ${color}2b, inset 0 0 0.5px ${color}55`
                  : '0 8px 22px rgba(0,0,0,0.45)',
                color: '#f7f7f9',
              }}
            >
              <span className="flex-1">{opt}</span>
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border text-lg"
                  style={{
                    color,
                    borderColor: `${color}66`,
                    backgroundColor: active ? `${color}1f` : iconBg,
                    boxShadow: active ? `0 0 18px ${color}33` : '0 0 0 transparent',
                  }}
                >
                  {Icon ? <Icon size={22} /> : '•'}
                </div>
                {active && (
                  <span
                    className="absolute -right-1.5 -bottom-1.5 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold text-white"
                    style={{
                      backgroundColor: color,
                      borderColor: `${color}80`,
                      boxShadow: `0 0 12px ${color}66`,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectionBlock;
