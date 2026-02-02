import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../ui';
import { formatDate } from '../../utils/helpers';
import { 
  Search, 
  MoreVertical, 
  Mail, 
  Ban, 
  Shield, 
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function UsersTable({ 
  users = [], 
  pagination,
  onPageChange,
  onUpdateUser,
  onBanUser,
  loading 
}) {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.id?.includes(search)
  );

  const handleAddCredits = async (userId, amount) => {
    await onUpdateUser?.(userId, { credits_add: amount });
  };

  const handleSetAdmin = async (userId, level) => {
    await onUpdateUser?.(userId, { admin_level: level });
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Пользователи</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Email</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Кредиты</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Генерации</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Роль</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Дата</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  Загрузка...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{user.email}</p>
                      <p className="text-gray-500 text-xs">{user.id?.slice(0, 8)}...</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user.credits > 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.credits === -1 ? '∞' : user.credits}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {user.generation_count || 0}
                  </td>
                  <td className="py-4 px-4">
                    {user.admin_level > 0 ? (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                        Admin L{user.admin_level}
                      </span>
                    ) : user.is_banned ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                        Заблокирован
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                        Пользователь
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Показано {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} из {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              disabled={pagination.offset === 0}
              onClick={() => onPageChange?.(pagination.offset - pagination.limit)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              disabled={pagination.offset + pagination.limit >= pagination.total}
              onClick={() => onPageChange?.(pagination.offset + pagination.limit)}
            />
          </div>
        </div>
      )}

      {/* User Actions Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Управление: ${selectedUser?.email}`}
        size="sm"
      >
        <div className="space-y-4">
          {/* Add Credits */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Добавить кредиты</p>
            <div className="flex gap-2">
              {[1, 5, 10, 50].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleAddCredits(selectedUser?.id, amount);
                    setShowModal(false);
                  }}
                >
                  +{amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Admin Level */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Уровень админа</p>
            <div className="flex gap-2">
              {[0, 10, 25, 50, 100].map(level => (
                <Button
                  key={level}
                  variant={selectedUser?.admin_level === level ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    handleSetAdmin(selectedUser?.id, level);
                    setShowModal(false);
                  }}
                >
                  {level === 0 ? 'User' : `L${level}`}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              icon={Mail}
              className="flex-1"
            >
              Написать
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Ban}
              onClick={() => {
                onBanUser?.(selectedUser?.id, !selectedUser?.is_banned);
                setShowModal(false);
              }}
            >
              {selectedUser?.is_banned ? 'Разблокировать' : 'Заблокировать'}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}

export default UsersTable;
