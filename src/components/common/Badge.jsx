const Badge = ({
  children,
  color = 'blue',
  size = 'md',
  variant = 'solid',
  className = ''
}) => {
  const colorClasses = {
    blue: {
      solid: 'bg-blue-100 text-blue-800 border-blue-200',
      outline: 'bg-transparent text-blue-700 border-blue-500',
    },
    purple: {
      solid: 'bg-purple-100 text-purple-800 border-purple-200',
      outline: 'bg-transparent text-purple-700 border-purple-500',
    },
    green: {
      solid: 'bg-green-100 text-green-800 border-green-200',
      outline: 'bg-transparent text-green-700 border-green-500',
    },
    red: {
      solid: 'bg-red-100 text-red-800 border-red-200',
      outline: 'bg-transparent text-red-700 border-red-500',
    },
    yellow: {
      solid: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      outline: 'bg-transparent text-yellow-700 border-yellow-500',
    },
    gray: {
      solid: 'bg-gray-100 text-gray-800 border-gray-200',
      outline: 'bg-transparent text-gray-700 border-gray-500',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-full border';
  const colorClass = colorClasses[color]?.[variant] || colorClasses.blue[variant];
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`${baseClasses} ${colorClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
