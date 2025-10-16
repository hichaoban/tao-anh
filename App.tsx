
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import {
  BACKGROUND_SUGGESTIONS,
  CLOTHING_SUGGESTIONS,
  EXPRESSION_SUGGESTIONS,
  PRODUCT_POSITION_SUGGESTIONS
} from './constants';

// Helper function to convert a file to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove data:mime/type;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

function App() {
  // State for uploaded images
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);

  // State for text inputs
  const [background, setBackground] = useState('');
  const [clothing, setClothing] = useState('');
  const [expression, setExpression] = useState('');
  const [productPosition, setProductPosition] = useState('');

  // State for API interaction
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('AI đang sáng tạo...');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!modelImage || !productImage) {
      setError('Vui lòng tải lên cả ảnh người mẫu và ảnh sản phẩm.');
      return;
    }

    setIsLoading(true);
    setLoaderMessage('AI đang sáng tạo...');
    setError(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

      const modelImageBase64 = await fileToBase64(modelImage);
      const productImageBase64 = await fileToBase64(productImage);

      const prompt = `Yêu cầu: Tạo một ảnh quảng cáo.
Đầu vào: ảnh 1 (người mẫu), ảnh 2 (sản phẩm).
Mô tả ảnh kết quả:
- Người mẫu: Giống hệt người trong ảnh 1.
- Sản phẩm: Giống hệt sản phẩm trong ảnh 2.
- Bối cảnh: ${background || 'studio chuyên nghiệp hiện đại'}.
- Trang phục người mẫu: ${clothing || 'phù hợp với sản phẩm và bối cảnh'}.
- Biểu cảm người mẫu: ${expression || 'tự tin và chuyên nghiệp'}.
- Vị trí sản phẩm: ${productPosition || 'nổi bật một cách tự nhiên'}.
Lưu ý: Kết quả trả về phải là một file ảnh. Không trả về văn bản.`;
      
      const modelImagePart = {
        inlineData: {
          data: modelImageBase64,
          mimeType: modelImage.type,
        },
      };

      const productImagePart = {
        inlineData: {
          data: productImageBase64,
          mimeType: productImage.type,
        },
      };

      const textPart = { text: prompt };
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [modelImagePart, productImagePart, textPart],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
          setGeneratedImage(imageUrl);
          foundImage = true;
          break;
        }
      }
      
      if (!foundImage) {
          const textResponse = response.text;
          console.error("API response text:", textResponse);
          setError(`Không thể tạo ảnh. Phản hồi từ AI: ${textResponse || 'Không có hình ảnh nào được trả về.'}`);
      }

    } catch (e: any) {
      console.error(e);
      setError(`Đã xảy ra lỗi: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [modelImage, productImage, background, clothing, expression, productPosition]);

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen text-gray-800 dark:text-gray-100">
      {isLoading && <Loader message={loaderMessage} />}
      <Header />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col gap-6">
            <h2 className="text-xl font-bold border-b pb-2 border-gray-200 dark:border-gray-700">Tùy Chỉnh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader id="model-image" title="Ảnh Người Mẫu (Khuôn mặt)" onImageUpload={setModelImage} />
              <ImageUploader id="product-image" title="Ảnh Sản Phẩm" onImageUpload={setProductImage} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Bối cảnh</label>
                    <select value={background} onChange={(e) => setBackground(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md bg-white dark:bg-gray-800">
                        <option value="">Chọn một bối cảnh</option>
                        {BACKGROUND_SUGGESTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Trang phục</label>
                    <select value={clothing} onChange={(e) => setClothing(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md bg-white dark:bg-gray-800">
                        <option value="">Chọn trang phục</option>
                        {CLOTHING_SUGGESTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Biểu cảm</label>
                    <select value={expression} onChange={(e) => setExpression(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md bg-white dark:bg-gray-800">
                        <option value="">Chọn biểu cảm</option>
                        {EXPRESSION_SUGGESTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Vị trí sản phẩm</label>
                    <select value={productPosition} onChange={(e) => setProductPosition(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md bg-white dark:bg-gray-800">
                        <option value="">Chọn vị trí sản phẩm</option>
                        {PRODUCT_POSITION_SUGGESTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            
            <button
              onClick={handleGenerateImage}
              disabled={isLoading || !modelImage || !productImage}
              className="w-full bg-amber-500 text-black font-bold py-3 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {isLoading ? 'Đang Tạo Ảnh...' : 'Tạo Ảnh'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>

          {/* Right Column: Output */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[500px]">
            <h2 className="text-xl font-bold border-b pb-2 mb-4 w-full text-center border-gray-200 dark:border-gray-700">Kết Quả</h2>
            <div className="w-full flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-md">
               {generatedImage ? (
                <>
                  <img src={generatedImage} alt="Generated ad" className="max-w-full max-h-[calc(100%-60px)] object-contain rounded-md" />
                  <a href={generatedImage} download="generated-ad-image.png" className="mt-4 bg-amber-500 text-black font-bold py-2 px-5 rounded-md hover:bg-amber-600 transition-all duration-300">
                      Tải ảnh về
                  </a>
                </>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">Kết quả sẽ xuất hiện ở đây</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
