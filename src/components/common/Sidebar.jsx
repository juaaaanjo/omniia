import { NavLink } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiClock, FiMail, FiDollarSign, FiSettings, FiTarget } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';
import clsx from 'clsx';

// Brain Icon Component
const BrainIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" />
    <path d="M12 5v14" />
    <path d="M9.5 7.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1z" />
  </svg>
);

const Sidebar = () => {
  const navItems = [
    {
      to: ROUTES.DASHBOARD,
      icon: FiHome,
    },
    {
      to: ROUTES.MARKETING,
      icon: FiTrendingUp,
    },
    {
      to: ROUTES.FORECASTING,
      icon: FiClock,
    },
    {
      to: ROUTES.REPORTS,
      icon: FiMail,
    },
    {
      to: ROUTES.FINANCE,
      icon: FiDollarSign,
    },
    {
      to: ROUTES.INTEGRATIONS,
      icon: FiSettings,
    },
    {
      to: ROUTES.ANALYTICS,
      icon: BrainIcon,
    },
    {
      to: ROUTES.PLANNING,
      icon: FiTarget,
    },
  ];

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <nav className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-4 flex flex-col items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.DASHBOARD}
              className={({ isActive }) =>
                clsx(
                  'group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200',
                  isActive
                    ? 'bg-indigo-100'
                    : 'hover:bg-gray-100'
                )
              }
            >
              {({ isActive }) => (
                <Icon
                  className={clsx(
                    'w-6 h-6 transition-colors',
                    isActive ? 'text-indigo-600' : 'text-gray-500'
                  )}
                />
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
