import React, { useRef, useState } from 'react';
import { useStore } from '../store';
import 'react-dropdown/style.css';
import { ChevronDown } from 'lucide-react';

const ImportExport: React.FC = () => {
  const { bookmarks, setBookmarks, toggleAddModal } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedBookmarks = JSON.parse(e.target?.result as string);
          setBookmarks(importedBookmarks);
        } catch (error) {
          console.error('Error importing bookmarks:', error);
          // TODO: Display error message to user
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const bookmarkData = JSON.stringify(bookmarks);
    const blob = new Blob([bookmarkData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'bookmarks.json';
    link.click();

    URL.revokeObjectURL(url);
  };

  const options = [
    { value: 'import', label: 'Import' },
    { value: 'export', label: 'Export' },
  ];

  const handleDropdownChange = (option: { value: string; label: string }) => {
    if (option.value === 'import') {
      handleImport();
    } else if (option.value === 'export') {
      handleExport();
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="mt-4 relative">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        onClick={toggleAddModal}
      >
        <span className="mr-2">+</span> Add Bookmark
      </button>
      <div className="ml-2 inline-block relative">
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={toggleDropdown}
        >
          Import/Export <ChevronDown className="ml-2" />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded shadow-md">
            {options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDropdownChange(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".json"
      />
    </div>
  );
};

export default ImportExport;
