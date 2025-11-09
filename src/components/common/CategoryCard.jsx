import clsx from 'clsx';

/**
 * CategoryCard component - displays metrics with category-specific styling
 * @param {string} category - Category type: 'marketing', 'finance', 'sac', 'retention', 'growth', 'data'
 * @param {string} title - Card title
 * @param {React.Component} icon - Icon component
 * @param {Array} metrics - Array of metric objects with {label, value}
 * @param {string} iconBgColor - Background color for icon (Tailwind class)
 * @param {string} iconColor - Icon color (Tailwind class)
 * @param {string} className - Additional CSS classes
 */
const CategoryCard = ({
  category = 'marketing',
  title,
  icon: Icon,
  metrics = [],
  iconBgColor,
  iconColor,
  className
}) => {
  const categoryClasses = {
    marketing: 'category-card-marketing',
    finance: 'category-card-finance',
    sac: 'category-card-sac',
    retention: 'category-card-retention',
    growth: 'category-card-growth',
    data: 'category-card-data',
  };

  // Default colors if not provided
  const defaultIconBg = {
    marketing: 'bg-marketing-50',
    finance: 'bg-finance-50',
    sac: 'bg-sac-50',
    retention: 'bg-retention-50',
    growth: 'bg-growth-50',
    data: 'bg-data-50',
  };

  const defaultIconColor = {
    marketing: 'text-marketing-500',
    finance: 'text-finance-500',
    sac: 'text-sac-500',
    retention: 'text-retention-500',
    growth: 'text-growth-500',
    data: 'text-data-500',
  };

  return (
    <div className={clsx('category-card card-hover', className)}>
      {/* Header with icon and title */}
      <div className="flex items-center gap-3 mb-5">
        {Icon && (
          <div className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            iconBgColor || defaultIconBg[category]
          )}>
            <Icon className={clsx('w-5 h-5', iconColor || defaultIconColor[category])} />
          </div>
        )}
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
      </div>

      {/* Metrics */}
      <div className="space-y-2.5">
        {metrics.map((metric, index) => (
          <div key={index} className="flex justify-between items-baseline">
            <span className="text-sm font-normal text-gray-500">{metric.label}</span>
            <span className="text-lg font-medium text-gray-900">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
