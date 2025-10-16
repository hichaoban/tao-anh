
import React from 'react';

const Loader: React.FC<{ message?: string }> = ({ message = 'AI đang xử lý, vui lòng chờ...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-amber-500"></div>
      <p className="text-white text-xl mt-6 font-semibold text-center px-4">{message}</p>
    </div>
  );
};

export default Loader;
