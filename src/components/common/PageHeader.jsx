import clsx from 'clsx';
import StatusBadge from './StatusBadge';

/**
 * PageHeader component - displays page title with optional status badge and action buttons
 * @param {string} title - Page title
 * @param {string} subtitle - Optional subtitle
 * @param {object} status - Status badge config {status: 'stable', label: 'Estable', showDot: true}
 * @param {React.Component} actions - Action buttons or components
 * @param {string} className - Additional CSS classes
 */
const PageHeader = ({
  title,
  subtitle,
  status,
  actions,
  className
}) => {
  return (
    <div className={clsx('mb-8', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {status && (
            <StatusBadge
              status={status.status || 'stable'}
              label={status.label}
              showDot={status.showDot !== false}
            />
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-base text-gray-600">{subtitle}</p>
      )}
    </div>
  );
};

export default PageHeader;
