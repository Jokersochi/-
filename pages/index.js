import React, { useState, useCallback } from 'react';
import { Header, Footer } from '../components/layout';
import { Card, FileUpload, Button } from '../components/ui';
import { SEO } from '../components/SEO';
import { 
  AuthModal, 
  StyleSelector, 
  GenerationResult, 
  HistoryPanel, 
  PaymentModal,
  ProgressIndicator,
  AdvancedOptions
} from '../components/features';
import { useGeneration } from '../hooks/useGeneration';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, ArrowRight, Star, Shield, Zap, Users } from 'lucide-react';

export default function Home() {
  // State
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState('modern');
  const [roomType, setRoomType] = useState('living');
  const [customPrompt, setCustomPrompt] = useState('');
  const [strength, setStrength] = useState(0.8);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Hooks
  const { generate, loading, error, result, progress, reset } = useGeneration();
  const { isAuthenticated, credits } = useAuth();

  // Handle file selection
  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  }, []);

  // Handle generation
  const handleGenerate = async () => {
    if (!file) return;
    
    // Check if user needs to login or buy credits
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    
    if (credits === 0) {
      setShowPayment(true);
      return;
    }

    await generate(file, style, { roomType, customPrompt, strength });
  };

  // Handle new generation
  const handleNewGeneration = () => {
    reset();
    setFile(null);
    setPreviewUrl(null);
    setCustomPrompt('');
  };

  // Features data
  const features = [
    {
      icon: Sparkles,
      title: '8 стилей дизайна',
      description: 'От современного минимализма до богемного шика',
    },
    {
      icon: Zap,
      title: 'Быстрая генерация',
      description: 'Результат за 30-60 секунд',
    },
    {
      icon: Star,
      title: 'HD качество',
      description: 'Профессиональные фотореалистичные изображения',
    },
    {
      icon: Shield,
      title: 'Безопасно',
      description: 'Ваши фото защищены и удаляются автоматически',
    },
    {
      icon: Users,
      title: '50,000+ пользователей',
      description: 'Нам доверяют дизайнеры по всему миру',
    },
  ];

  return (
    <>
      <SEO 
        title="Дизайн интерьера с искусственным интеллектом"
        description="Преобразите свою комнату с помощью ИИ. Загрузите фото и получите профессиональный дизайн за секунды. 8 стилей дизайна, HD качество."
        url="/"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white">
        <Header 
          onShowAuth={() => setShowAuth(true)} 
          onShowHistory={() => setShowHistory(true)}
        />

        <main className="flex-1">
          {/* Hero Section */}
          {!result && !loading && (
            <section className="py-12 px-6 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  Powered by AI
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Преобразите комнату с помощью ИИ
                </h1>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Загрузите фото вашей комнаты, выберите стиль — и получите профессиональный дизайн интерьера за секунды
                </p>
              </div>
            </section>
          )}

          {/* Main Content */}
          <section className="py-8 px-6">
            <div className="max-w-4xl mx-auto">
              {/* Loading State */}
              {loading && (
                <Card className="p-12">
                  <ProgressIndicator progress={progress} />
                  <p className="text-center text-gray-400 mt-6">
                    Пожалуйста, подождите. Создаём ваш уникальный дизайн...
                  </p>
                </Card>
              )}

              {/* Result State */}
              {result && !loading && (
                <GenerationResult
                  originalImage={previewUrl}
                  generatedImage={result}
                  style={style}
                  onNewGeneration={handleNewGeneration}
                  onPayment={() => setShowPayment(true)}
                  isPaid={credits > 0 || credits === -1}
                />
              )}

              {/* Upload Form */}
              {!result && !loading && (
                <Card className="p-8">
                  <div className="space-y-8">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-3">
                        Загрузите фото комнаты
                      </label>
                      <FileUpload 
                        onFileSelect={handleFileSelect}
                        maxSize={10 * 1024 * 1024}
                        accept="image/jpeg,image/png,image/webp"
                      />
                    </div>

                    {/* Style Selector */}
                    <StyleSelector 
                      value={style} 
                      onChange={setStyle}
                      disabled={loading}
                    />

                    {/* Advanced Options */}
                    <AdvancedOptions
                      roomType={roomType}
                      onRoomTypeChange={setRoomType}
                      customPrompt={customPrompt}
                      onCustomPromptChange={setCustomPrompt}
                      strength={strength}
                      onStrengthChange={setStrength}
                      disabled={loading}
                    />

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
                        {error}
                      </div>
                    )}

                    {/* Generate Button */}
                    <Button
                      fullWidth
                      size="lg"
                      onClick={handleGenerate}
                      disabled={!file || loading}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      {!isAuthenticated 
                        ? 'Войти и сгенерировать' 
                        : credits === 0 
                          ? 'Купить кредиты' 
                          : 'Сгенерировать дизайн'
                      }
                    </Button>

                    {/* Credits Info */}
                    {isAuthenticated && (
                      <p className="text-center text-sm text-gray-400">
                        {credits === -1 
                          ? 'У вас безлимитный доступ' 
                          : `Осталось ${credits} генераций`
                        }
                        {credits >= 0 && credits < 3 && (
                          <button 
                            onClick={() => setShowPayment(true)}
                            className="ml-2 text-blue-400 hover:text-blue-300"
                          >
                            Пополнить
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </section>

          {/* Features Section */}
          {!result && !loading && (
            <section className="py-16 px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-12">
                  Почему RoomGenius?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {features.map((feature, idx) => (
                    <Card key={idx} hover className="text-center">
                      <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* How It Works */}
          {!result && !loading && (
            <section className="py-16 px-6 bg-white/5">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-12">Как это работает</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold mb-4">
                      1
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Загрузите фото</h3>
                    <p className="text-gray-400 text-sm">
                      Сфотографируйте вашу комнату или загрузите готовое фото
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-2xl font-bold mb-4">
                      2
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Выберите стиль</h3>
                    <p className="text-gray-400 text-sm">
                      Современный, минимализм, скандинавский и другие
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-2xl font-bold mb-4">
                      3
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Получите дизайн</h3>
                    <p className="text-gray-400 text-sm">
                      ИИ преобразит вашу комнату за считанные секунды
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />

        {/* Modals */}
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        <HistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
        <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
      </div>
    </>
  );
}
