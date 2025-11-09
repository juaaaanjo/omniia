import clsx from 'clsx';

/**
 * SectionHeader component - consistent section heading with optional subtitle
 * @param {string} title - Main heading text
 * @param {string} subtitle - Optional subtitle text
 * @param {React.Component} action - Optional action component (button, etc.)
 * @param {string} className - Additional CSS classes
 * @param {string} borderColor - Optional left border color (Tailwind class)
 */
const SectionHeader = ({
  title,
  subtitle,
  action,
  className,
  borderColor = 'border-primary-500'
}) => {
  return (
    <div className={clsx('relative mb-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 relative">
          {/* Gradient border */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-900 pl-4">{title}</h2>
        </div>
        <div className="flex items-center gap-4">
          {subtitle && (
            <>
              {/* Fading horizontal line */}
              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent" style={{ width: '200px' }}></div>
              <p className="text-sm text-gray-500 whitespace-nowrap">{subtitle}</p>
            </>
          )}
          {action}
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
