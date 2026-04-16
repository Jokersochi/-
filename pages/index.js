import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, X, Upload } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!file) return alert('Пожалуйста, загрузите фото');
    setLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('rooms')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('rooms')
        .getPublicUrl(fileName);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl, style }),
      });

      const resultData = await res.json();
      if (resultData.error) throw new Error(resultData.error);
      
      setResult(resultData.output);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 text-white">
      <h1 className="text-4xl font-bold mb-8">RoomGenius AI</h1>
      
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md border border-white/20">
        <label htmlFor="room-photo" className="block text-sm font-medium mb-2">Загрузите фото комнаты</label>
        <input 
          id="room-photo"
          type="file" 
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm mb-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none"
        />

        <label htmlFor="design-style" className="block text-sm font-medium mb-2">Выберите стиль</label>
        <select 
          id="design-style"
          value={style} 
          onChange={(e) => setStyle(e.target.value)} 
          className="block w-full p-3 bg-gray-900 border border-white/20 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none text-white"
        >
          <option value="modern">Современный</option>
          <option value="minimalist">Минимализм</option>
          <option value="scandi">Скандинавский</option>
          <option value="industrial">Индустриальный</option>
          <option value="bohemian">Богемный</option>
        </select>

        {previewUrl && (
          <div className="relative mb-6 rounded-xl overflow-hidden border border-white/20 bg-black/40">
            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors text-white"
              aria-label="Удалить фото"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Генерация...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Сгенерировать дизайн
            </>
          )}
        </button>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Результат:</h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <img src={result} alt="Generated Design" className="w-full h-auto" />
          </div>
          <div className="mt-6 flex justify-center">
             <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition">
               Оплатить (Yookassa)
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
