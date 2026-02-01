import React, { useState } from 'react';
import { Modal, Button, Input } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User } from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { signIn, signUp, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        onClose();
        resetForm();
      }
    } else if (mode === 'register') {
      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess('Проверьте вашу почту для подтверждения регистрации');
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(null);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  const titles = {
    login: 'Вход в аккаунт',
    register: 'Регистрация',
    forgot: 'Восстановление пароля',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titles[mode]} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          icon={Mail}
          autoComplete="email"
        />

        {mode !== 'forgot' && (
          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        )}

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
            {success}
          </div>
        )}

        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
          icon={mode === 'register' ? User : undefined}
        >
          {mode === 'login' && 'Войти'}
          {mode === 'register' && 'Зарегистрироваться'}
          {mode === 'forgot' && 'Отправить ссылку'}
        </Button>

        <div className="text-center text-sm">
          {mode === 'login' && (
            <>
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Забыли пароль?
              </button>
              <div className="mt-3">
                <span className="text-gray-500">Нет аккаунта? </span>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Зарегистрироваться
                </button>
              </div>
            </>
          )}
          {mode === 'register' && (
            <div>
              <span className="text-gray-500">Уже есть аккаунт? </span>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Войти
              </button>
            </div>
          )}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Вернуться к входу
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default AuthModal;
