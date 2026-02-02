import React from 'react';
import Head from 'next/head';
import { withAuth } from '../../middleware/withAuth';
import { DashboardSidebar } from '../../components/dashboard';
import { Card, Button } from '../../components/ui';
import { useHistory } from '../../hooks/useHistory';
import { formatDate } from '../../utils/helpers';
import { Download, Trash2, Eye, Loader2 } from 'lucide-react';

function HistoryPage() {
  const { history, loading, pagination, loadMore, deleteItem } = useHistory(true);

  const handleDelete = async (id) => {
    if (confirm('Удалить эту генерацию?')) {
      await deleteItem(id);
    }
  };

  return (
    <>
      <Head>
        <title>История генераций | RoomGenius AI</title>
      </Head>

      <div className="min-h-screen bg-black flex">
        <DashboardSidebar className="hidden lg:flex" />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-8">История генераций</h1>

            {loading && history.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : history.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-400">История генераций пуста</p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map((item) => (
                    <Card key={item.id} padding="none" className="overflow-hidden group">
                      <div className="aspect-video relative">
                        <img
                          src={item.generated_image_url}
                          alt={item.style}
                          className="w-full h-full object-cover"
                        />
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
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full capitalize">
                            {item.style}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {pagination.hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      loading={loading}
                    >
                      Загрузить ещё
                    </Button>
                  </div>
                )}

                <p className="text-center text-gray-500 text-sm mt-4">
                  Показано {history.length} из {pagination.total}
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default withAuth(HistoryPage, { requireAuth: true });
