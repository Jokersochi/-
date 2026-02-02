/**
 * Batch Processor Component
 * Process multiple images at once
 */

import { useState } from 'react';
import { uploadFile } from '../services/storage.service';
import { generateDesign } from '../services/generation.service';
import { validateFile } from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function BatchProcessor({ style, onComplete }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFilesSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate each file
    const validFiles = [];
    const fileErrors = [];

    selectedFiles.forEach((file, index) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        fileErrors.push(`${file.name}: ${validation.error}`);
      }
    });

    setFiles(validFiles);
    if (fileErrors.length > 0) {
      setErrors(fileErrors);
    }
  };

  const processBatch = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setProgress({ current: 0, total: files.length });
    setResults([]);
    setErrors([]);

    const batchResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Upload image
        const imageUrl = await uploadFile(file);
        
        // Generate design
        const generatedUrl = await generateDesign(imageUrl, style);
        
        batchResults.push({
          filename: file.name,
          original: imageUrl,
          generated: generatedUrl,
          status: 'success',
        });
      } catch (error) {
        batchResults.push({
          filename: file.name,
          status: 'error',
          error: error.message,
        });
      }

      setProgress({ current: i + 1, total: files.length });
      setResults([...batchResults]);
    }

    setProcessing(false);
    
    if (onComplete) {
      onComplete(batchResults);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* File Input */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">
          Выберите изображения (макс. 10)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFilesSelect}
          disabled={processing}
          max={10}
          className="block w-full text-sm text-white
            file:mr-4 file:py-2 file:px-4 
            file:rounded-full file:border-0 
            file:text-sm file:font-semibold 
            file:bg-blue-600 file:text-white 
            hover:file:bg-blue-700 
            file:cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer"
        />
        <p className="mt-2 text-xs text-gray-400">
          Выберите до 10 изображений для одновременной обработки
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3">
            Выбрано файлов: {files.length}
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                <span className="text-sm text-gray-300 truncate flex-1">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 mx-2">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                {!processing && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Button */}
      {files.length > 0 && !processing && (
        <button
          onClick={processBatch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
        >
          Обработать {files.length} {files.length === 1 ? 'изображение' : 'изображений'}
        </button>
      )}

      {/* Progress */}
      {processing && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <LoadingSpinner
            progress={(progress.current / progress.total) * 100}
            message={`Обработка ${progress.current} из ${progress.total}...`}
          />
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <ErrorMessage key={index} message={error} />
          ))}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Результаты обработки
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300 truncate flex-1">
                    {result.filename}
                  </span>
                  {result.status === 'success' ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <span className="text-red-400 text-xs">✗</span>
                  )}
                </div>
                
                {result.status === 'success' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <img
                      src={result.original}
                      alt="Original"
                      className="w-full h-24 object-cover rounded"
                    />
                    <img
                      src={result.generated}
                      alt="Generated"
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-red-400">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
