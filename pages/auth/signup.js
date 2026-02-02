/**
 * Signup Page
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import ErrorMessage from '../../components/ErrorMessage';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp({ email, password, name });
      setSuccess(true);
      // Redirect after short delay
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-md">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Успешная регистрация!</h2>
            <p className="text-gray-300">Проверьте email для подтверждения</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            RoomGenius AI
          </h1>
          <p className="text-gray-400">Создайте аккаунт</p>
        </div>

        <div className="bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-gray-900 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-gray-900 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 bg-gray-900 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-400">Минимум 6 символов</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Уже есть аккаунт?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
