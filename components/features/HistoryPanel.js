import React from 'react';
import { useHistory } from '../../hooks/useHistory';
import { Card, Button, Modal } from '../ui';
import { formatDate } from '../../utils/helpers';
import { Trash2, Download, Eye, Loader2 } from 'lucide-react';

export function HistoryPanel({ isOpen, onClose }) {
  const { history, loading, pagination, loadMore, deleteItem } = useHistory(isOpen);

  const handleDelete = async (id) => {
    if (confirm('Удалить эту генерацию?')) {
      await deleteItem(id);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="История генераций" 
      size="full"
    >
      {loading && history.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">История генераций пуста</p>
          <p className="text-sm text-gray-500 mt-2">
            Создайте свой первый дизайн!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
            {history.map((item) => (
              <Card key={item.id} padding="none" hover className="overflow-hidden group">
                <div className="relative aspect-video">
                  <img
                    src={item.generated_image_url}
                    alt={`Design ${item.style}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => window.open(item.generated_image_url, '_blank')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Download}
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = item.generated_image_url;
                        a.download = `design-${item.id}.jpg`;
                        a.click();
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white font-medium capitalize">{item.style}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          {pagination.hasMore && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={loadMore}
                loading={loading}
              >
                Загрузить ещё
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="text-center text-sm text-gray-400 mt-4">
            Показано {history.length} из {pagination.total}
          </div>
        </>
      )}
    </Modal>
  );
}

export default HistoryPanel;
