import clsx from 'clsx';

/**
 * QuickActionButton component - pill-shaped action button from design system
 * @param {string} label - Button text
 * @param {function} onClick - Click handler
 * @param {React.Component} icon - Optional icon component
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} className - Additional CSS classes
 */
const QuickActionButton = ({
  label,
  onClick,
  icon: Icon,
  disabled = false,
  className
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'btn-pill',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 inline-block mr-2" />}
      {label}
    </button>
  );
};

export default QuickActionButton;
