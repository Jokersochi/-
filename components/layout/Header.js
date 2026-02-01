import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';
import { User, LogOut, History, Sparkles } from 'lucide-react';

export function Header({ onShowAuth, onShowHistory }) {
  const { user, isAuthenticated, credits, signOut, loading } = useAuth();

  return (
    <header className="w-full py-4 px-6 border-b border-white/10 backdrop-blur-md bg-black/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">RoomGenius AI</h1>
            <p className="text-xs text-gray-400">Дизайн интерьера с ИИ</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Credits */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">
                  {credits === -1 ? '∞' : credits} кредитов
                </span>
              </div>

              {/* History */}
              <Button 
                variant="ghost" 
                size="sm" 
                icon={History}
                onClick={onShowHistory}
                className="hidden sm:inline-flex"
              >
                История
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-white font-medium">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={signOut}
                  loading={loading}
                />
              </div>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={User}
              onClick={onShowAuth}
            >
              Войти
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
