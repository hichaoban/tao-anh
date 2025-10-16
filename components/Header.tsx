
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md p-4 mb-8">
      <div className="container mx-auto flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-amber-400">Trình Tạo Ảnh Quảng Cáo AI</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">app được tạo bởi Trung Thành - 0985.358.136</p>
        </div>
      </div>
    </header>
  );
};

export default Header;