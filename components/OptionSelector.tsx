
import React from 'react';

interface OptionSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ label, value, onChange, suggestions, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900 dark:text-gray-200"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onChange(suggestion)}
            className="px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 rounded-full hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;
