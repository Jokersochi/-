import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Wand2, Loader2, X } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState('modern');
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleGenerate = async () => {
    if (!file) return alert('Пожалуйста, загрузите фото');
    setLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
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
        <label htmlFor="file-upload" className="block text-sm font-medium mb-2">Загрузите фото комнаты</label>
        <input 
          id="file-upload"
          ref={fileInputRef}
          type="file" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="block w-full text-sm mb-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none"
        />

        {preview && (
          <div className="relative mb-6 group">
            <img src={preview} alt="Room preview" className="w-full h-48 object-cover rounded-xl border border-white/20" />
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              aria-label="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <label htmlFor="style-select" className="block text-sm font-medium mb-2">Выберите стиль</label>
        <select 
          id="style-select"
          value={style} 
          onChange={(e) => setStyle(e.target.value)} 
          className="block w-full p-3 bg-gray-900 border border-white/20 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none text-white"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Генерация...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Сгенерировать дизайн</span>
            </>
          )}
        </button>

        {error && <p aria-live="polite" className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Результат:</h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <img src={result} alt="Generated Design" className="w-full h-auto" />
          </div>
          <div className="mt-6 flex justify-center">
             <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none">
               Оплатить (Yookassa)
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
