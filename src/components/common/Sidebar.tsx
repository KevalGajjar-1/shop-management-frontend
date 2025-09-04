import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, Package } from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

const Sidebar: React.FC = () => {
  const navItems: NavItem[] = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/shops', icon: Store, label: 'My Shops' },
    { to: '/products', icon: Package, label: 'Products' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
