import React, { useState } from 'react';

export default function Home() {
  const [style, setStyle] = useState('modern');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">RoomGenius MVP</h1>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Загрузите фото комнаты</label>
        <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4" />
        
        <label className="block text-sm font-medium text-gray-700 mb-2">Выберите стиль</label>
        <select value={style} onChange={(e) => setStyle(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-md mb-6">
          <option value="modern">Минимализм</option>
          <option value="loft">Лофт</option>
          <option value="scandi">Скандинавский</option>
        </select>
        
        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-200">
          Сгенерировать дизайн
        </button>
      </div>
    </div>
  );
}
