import React, { useState } from 'react';
import { Button, Card } from '../ui';
import { cn } from '../../utils/helpers';
import { 
  Download, 
  RefreshCw, 
  ZoomIn, 
  Share2, 
  CreditCard,
  Check,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export function GenerationResult({ 
  originalImage, 
  generatedImage, 
  style, 
  onNewGeneration, 
  onPayment,
  isPaid = false,
}) {
  const [compareMode, setCompareMode] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleDownload = async () => {
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roomgenius-${style}-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Мой дизайн интерьера от RoomGenius',
          text: `Посмотрите мой новый дизайн в стиле ${style}!`,
          url: generatedImage,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share error:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(generatedImage);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Result Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Ваш новый дизайн готов!
        </h2>
        <p className="text-gray-400">
          Стиль: <span className="text-white font-medium">{style}</span>
        </p>
      </div>

      {/* Image Container */}
      <Card padding="none" className="overflow-hidden">
        {compareMode ? (
          // Before/After Comparison
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded-full text-white text-sm font-medium">
                До
              </div>
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-auto object-cover"
                onClick={() => setZoomedImage(originalImage)}
              />
            </div>
            <div className="relative">
              <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 rounded-full text-white text-sm font-medium">
                После
              </div>
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-auto object-cover cursor-pointer"
                onClick={() => setZoomedImage(generatedImage)}
              />
            </div>
          </div>
        ) : (
          // Single Image View
          <div className="relative group">
            <img
              src={generatedImage}
              alt="Generated Design"
              className="w-full h-auto cursor-pointer transition-transform duration-300"
              onClick={() => setZoomedImage(generatedImage)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-12 h-12 text-white" />
            </div>
            
            {/* Watermark if not paid */}
            {!isPaid && (
              <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 rounded-lg text-white text-sm">
                Предпросмотр • Оплатите для скачивания HD
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="outline"
          icon={compareMode ? ArrowLeft : ArrowRight}
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? 'Только результат' : 'Сравнить'}
        </Button>

        {isPaid ? (
          <>
            <Button
              variant="primary"
              icon={Download}
              onClick={handleDownload}
            >
              Скачать HD
            </Button>
            <Button
              variant="ghost"
              icon={Share2}
              onClick={handleShare}
            >
              Поделиться
            </Button>
          </>
        ) : (
          <Button
            variant="success"
            icon={CreditCard}
            onClick={onPayment}
          >
            Оплатить и скачать HD
          </Button>
        )}

        <Button
          variant="secondary"
          icon={RefreshCw}
          onClick={onNewGeneration}
        >
          Новая генерация
        </Button>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <span className="text-white text-2xl">&times;</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default GenerationResult;
