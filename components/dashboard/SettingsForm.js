import React, { useState } from 'react';
import { Card, Button, Input } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { User, Mail, Lock, Globe, Bell, Trash2 } from 'lucide-react';

export function SettingsForm() {
  const { user, profile } = useAuth();
  const { locale, setLocale, locales } = useLocale();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: user?.email || '',
    notifications: profile?.notifications ?? true,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // API call to update profile
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      setSuccess('Настройки сохранены');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Профиль
        </h3>

        <div className="space-y-4">
          <Input
            label="Имя"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ваше имя"
            icon={User}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            disabled
            icon={Mail}
          />
        </div>
      </Card>

      {/* Language Settings */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Язык
        </h3>

        <div className="flex gap-3">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              className={`px-6 py-3 rounded-xl border-2 transition-all ${
                locale === loc
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-white/20 text-gray-400 hover:border-white/40'
              }`}
            >
              {loc === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Уведомления
        </h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-300">Email уведомления о генерациях</span>
            <div 
              className={`w-12 h-6 rounded-full relative transition-colors ${
                formData.notifications ? 'bg-blue-500' : 'bg-gray-600'
              }`}
              onClick={() => handleChange('notifications', !formData.notifications)}
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.notifications ? 'left-7' : 'left-1'
                }`}
              />
            </div>
          </label>
        </div>
      </Card>

      {/* Password Change */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Безопасность
        </h3>

        <Button variant="outline">
          Изменить пароль
        </Button>
      </Card>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading}>
          Сохранить изменения
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-500/30">
        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Опасная зона
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Удаление аккаунта необратимо. Все ваши данные будут удалены.
        </p>
        <Button variant="danger" size="sm">
          Удалить аккаунт
        </Button>
      </Card>
    </div>
  );
}

export default SettingsForm;
