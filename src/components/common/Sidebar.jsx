import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiTrendingUp,
  FiShoppingCart,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';
import { useLanguage } from '../../hooks/useLanguage';
import clsx from 'clsx';

const Sidebar = () => {
  const { t } = useLanguage();

  const navItems = [
    {
      to: ROUTES.DASHBOARD,
      icon: FiHome,
      label: t.nav.dashboard,
    },
    {
      to: ROUTES.MARKETING,
      icon: FiTrendingUp,
      label: t.nav.marketing,
    },
    {
      to: ROUTES.SALES,
      icon: FiShoppingCart,
      label: t.nav.sales,
    },
    {
      to: ROUTES.FINANCE,
      icon: FiDollarSign,
      label: t.nav.finance,
    },
    {
      to: ROUTES.ANALYTICS,
      icon: FiBarChart2,
      label: t.nav.analytics,
    },
    {
      to: ROUTES.INTEGRATIONS,
      icon: FiSettings,
      label: t.settings.integrations,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.DASHBOARD}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={clsx(
                      'w-5 h-5',
                      isActive ? 'text-primary-600' : 'text-gray-500'
                    )}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick stats */}
      <div className="p-4 mt-6 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
          {t.dashboard.quickStats}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t.marketing.campaigns} {t.marketing.active}</span>
            <span className="text-sm font-semibold text-gray-900">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t.sales.total}</span>
            <span className="text-sm font-semibold text-gray-900">$45.2K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t.kpi.roi}</span>
            <span className="text-sm font-semibold text-green-600">+24.5%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
