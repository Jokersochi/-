/**
 * ResultDisplay Component
 * Displays generated design result with payment option
 */

import React from 'react';

export default function ResultDisplay({ imageUrl, onPayment, paymentLoading = false }) {
  if (!imageUrl) return null;

  return (
    <div className="mt-12 w-full max-w-4xl animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Результат генерации:
      </h2>
      
      {/* Generated Image */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm">
        <img 
          src={imageUrl} 
          alt="Generated Interior Design" 
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
      
      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        {/* Download Button */}
        <a
          href={imageUrl}
          download="room-design.jpg"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-center"
        >
          Скачать изображение
        </a>
        
        {/* Payment Button */}
        <button 
          onClick={onPayment}
          disabled={paymentLoading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paymentLoading ? 'Обработка...' : 'Оплатить (499 ₽)'}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Получите полное разрешение и дополнительные варианты за 499 ₽
        </p>
      </div>
    </div>
  );
}
