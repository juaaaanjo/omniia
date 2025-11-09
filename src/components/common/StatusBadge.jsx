import clsx from 'clsx';

/**
 * StatusBadge component - displays a status indicator with optional dot
 * @param {string} status - The status type: 'stable', 'pending', 'executed', 'review'
 * @param {string} label - The text to display
 * @param {boolean} showDot - Whether to show the status dot indicator
 * @param {string} className - Additional CSS classes
 */
const StatusBadge = ({
  status = 'stable',
  label,
  showDot = true,
  className
}) => {
  const statusClasses = {
    stable: 'badge-stable',
    pending: 'badge-pending',
    executed: 'badge-executed',
    review: 'badge-review',
  };

  const dotColors = {
    stable: 'bg-status-stable-500',
    pending: 'bg-status-pending-500',
    executed: 'bg-status-executed-500',
    review: 'bg-status-review-500',
  };

  return (
    <span className={clsx('badge', statusClasses[status], className)}>
      {showDot && (
        <span className={clsx('w-2 h-2 rounded-full', dotColors[status])} />
      )}
      {label}
    </span>
  );
};

export default StatusBadge;
