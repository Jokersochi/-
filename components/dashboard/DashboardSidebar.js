import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '../../utils/helpers';
import { 
  LayoutDashboard, 
  ImageIcon, 
  CreditCard, 
  Settings, 
  Users, 
  Gift,
  History,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { href: '/dashboard/history', label: 'История', icon: History },
  { href: '/dashboard/subscription', label: 'Подписка', icon: CreditCard },
  { href: '/dashboard/referrals', label: 'Рефералы', icon: Users },
  { href: '/dashboard/settings', label: 'Настройки', icon: Settings },
];

export function DashboardSidebar({ className }) {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const isActive = (href) => {
    if (href === '/dashboard') {
      return router.pathname === '/dashboard';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <aside className={cn(
      'w-64 bg-gray-900 border-r border-white/10 min-h-screen flex flex-col',
      className
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">RoomGenius</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{user?.email}</p>
            <p className="text-sm text-gray-400">
              {profile?.credits === -1 ? '∞' : profile?.credits || 0} кредитов
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
              isActive(item.href)
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Quick Action */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
        >
          <ImageIcon className="w-5 h-5" />
          Создать дизайн
        </Link>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
