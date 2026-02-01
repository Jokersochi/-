/**
 * Home Page - RoomGenius AI
 * Main application page with modular architecture
 */

import React from 'react';
import { useImageGeneration } from '../hooks/useImageGeneration';
import { usePayment } from '../hooks/usePayment';
import FileUpload from '../components/FileUpload';
import StyleSelector from '../components/StyleSelector';
import GenerateButton from '../components/GenerateButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ResultDisplay from '../components/ResultDisplay';

export default function Home() {
  // Custom hooks for business logic
  const {
    file,
    style,
    loading,
    uploadProgress,
    result,
    error,
    handleFileSelect,
    handleStyleChange,
    generate,
    clearError,
  } = useImageGeneration();

  const {
    loading: paymentLoading,
    error: paymentError,
    initiatePayment,
    clearError: clearPaymentError,
  } = usePayment();

  // Handle payment
  const handlePayment = async () => {
    try {
      await initiatePayment({
        amount: 499,
        description: 'RoomGenius AI - Дизайн интерьера',
        metadata: {
          style,
          resultUrl: result,
        },
      });
    } catch (err) {
      // Error is handled by the hook
      console.error('Payment failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center p-6 text-white">
      {/* Header */}
      <header className="w-full max-w-6xl mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          RoomGenius AI
        </h1>
        <p className="text-gray-400 text-lg">
          Преобразите ваш интерьер с помощью искусственного интеллекта
        </p>
      </header>

      {/* Main Form */}
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md border border-white/20">
        <FileUpload
          onFileSelect={handleFileSelect}
          disabled={loading}
        />

        <StyleSelector
          value={style}
          onChange={handleStyleChange}
          disabled={loading}
        />

        <GenerateButton
          onClick={generate}
          loading={loading}
          disabled={!file}
        />

        {/* Error Messages */}
        <ErrorMessage message={error} onDismiss={clearError} />
        <ErrorMessage message={paymentError} onDismiss={clearPaymentError} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-12">
          <LoadingSpinner
            progress={uploadProgress}
            message="Генерируем дизайн вашей комнаты..."
          />
        </div>
      )}

      {/* Result Display */}
      <ResultDisplay
        imageUrl={result}
        onPayment={handlePayment}
        paymentLoading={paymentLoading}
      />

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-6 text-center text-gray-500 text-sm">
        <p>© 2026 RoomGenius AI. Все права защищены.</p>
        <p className="mt-2">
          Powered by AI • Replicate • Supabase
        </p>
      </footer>
    </div>
  );
}
