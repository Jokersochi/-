import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, X, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleGenerate = useCallback(async () => {
    if (!file) {
      setError('Пожалуйста, загрузите фото');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      let currentUrl = uploadedUrl;

      if (!currentUrl) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('rooms')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('rooms')
          .getPublicUrl(fileName);

        currentUrl = publicUrl;
        setUploadedUrl(currentUrl);
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: currentUrl, style }),
      });

      const resultData = await res.json();
      if (resultData.error) throw new Error(resultData.error);

      setResult(resultData.output);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [file, style, uploadedUrl]);

  const handleRemove = useCallback(() => {
    setFile(null);
    setUploadedUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 text-white">
      <h1 className="text-4xl font-bold mb-8">RoomGenius AI</h1>

      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md border border-white/20">
        <label htmlFor="file-upload" className="block text-sm font-medium mb-2">Загрузите фото комнаты</label>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setUploadedUrl(null);
            setResult(null);
          }}
          className="block w-full text-sm mb-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
        />

        {preview && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2">Предпросмотр:</p>
            <div className="rounded-lg overflow-hidden border border-white/10 aspect-video relative">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={handleRemove}
                aria-label="Удалить фото"
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <label htmlFor="style-select" className="block text-sm font-medium mb-2">Выберите стиль</label>
        <select
          id="style-select"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="block w-full p-3 bg-gray-900 border border-white/20 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none text-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <option value="modern">Современный</option>
          <option value="minimalist">Минимализм</option>
          <option value="scandi">Скандинавский</option>
          <option value="industrial">Индустриальный</option>
          <option value="bohemian">Богемный</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          aria-busy={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Генерация...</span>
            </>
          ) : (
            'Сгенерировать дизайн'
          )}
        </button>

        {error && (
          <p role="alert" aria-live="polite" className="mt-4 text-red-400 text-sm">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Результат:</h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <img src={result} alt="Generated Design" className="w-full h-auto" />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.open(result, '_blank', 'noopener,noreferrer')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Открыть результат для скачивания"
            >
              <Download className="h-5 w-5" />
              Скачать
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              Оплатить (Yookassa)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
