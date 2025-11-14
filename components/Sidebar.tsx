import React from 'react';
import { ICONS } from '../constants';
import { View } from '../types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badgeCount?: number;
}

// FIX: Changed component definition to use React.FC to correctly type it as a React component.
// This helps TypeScript understand that 'key' is a special React prop and not part of NavItemProps.
const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick, badgeCount }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${
      active
        ? 'bg-primary-blue text-white'
        : 'text-gray-300 hover:bg-primary-dark-hover hover:text-white'
    }`}
  >
    <div className="flex items-center">
      <span className="mr-3">{icon}</span>
      {label}
    </div>
    {badgeCount && badgeCount > 0 ? (
      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {badgeCount}
      </span>
    ) : null}
  </button>
);

interface SidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
    lowStockCount: number;
    theme: string;
    onToggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, lowStockCount, theme, onToggleTheme }) => {
    const navItems: {id: View, label: string, icon: React.ReactNode}[] = [
        { id: 'home', label: 'Início', icon: ICONS.home },
        { id: 'pos', label: 'PDV', icon: ICONS.cart },
        { id: 'sales-history', label: 'Vendas', icon: ICONS.dollarSign },
        { id: 'products', label: 'Produtos', icon: ICONS.package },
        { id: 'employees', label: 'Funcionários', icon: ICONS.user },
        { id: 'suppliers', label: 'Fornecedores', icon: ICONS.truck },
        { id: 'reports', label: 'Relatórios', icon: ICONS.chart },
        { id: 'settings', label: 'Configurações', icon: ICONS.settings },
    ];

  return (
    <div className="w-64 bg-primary-dark text-white flex flex-col flex-shrink-0 print:hidden">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wider">POS PRO</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
            <NavItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activeView === item.id}
                onClick={() => onNavigate(item.id)}
                badgeCount={item.id === 'products' ? lowStockCount : undefined}
            />
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={onToggleTheme} className="flex items-center text-sm text-gray-300 hover:text-white w-full">
          <span className="mr-3">{theme === 'light' ? ICONS.moon : ICONS.sun}</span>
          {theme === 'light' ? 'Tema Escuro' : 'Tema Claro'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;