import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
        <label htmlFor="room-photo" className="block text-sm font-medium mb-2">Загрузите фото комнаты</label>
        <input 
          id="room-photo"
          type="file" 
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (selectedFile) {
              const objectUrl = URL.createObjectURL(selectedFile);
              setPreview(objectUrl);
            } else {
              setPreview(null);
            }
          }}
          className="block w-full text-sm mb-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
        />

        {preview && (
          <div className="mb-6 rounded-xl overflow-hidden border border-white/20">
            <img src={preview} alt="Selected room" className="w-full h-auto max-h-64 object-cover" />
          </div>
        )}

        <label htmlFor="style-select" className="block text-sm font-medium mb-2">Выберите стиль</label>
        <select 
          id="style-select"
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

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Генерация...</span>
            </>
          ) : (
            'Сгенерировать дизайн'
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
