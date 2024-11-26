import React, { useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { EditBookmarkModal } from './components/EditBookmarkModal';
import { AddCollectionModal } from './components/AddCollectionModal';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from './store';
import { getOgImageUrl } from './utils/screenshot';

function App() {
  const { toggleAddModal, bookmarks, setBookmarks } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const htmlString = e.target?.result as string;
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, 'text/html');
          const links = Array.from(doc.querySelectorAll('a'));
          const importedBookmarks = await Promise.all(links.map(async (link) => ({
            id: Date.now().toString(), // Generate a new ID
            title: link.textContent || '',
            url: link.href || '',
            favicon: '', // No favicon information in HTML
            wallpaper: await getOgImageUrl(link.href || ''), // Fetch wallpaper
            collection: '', // No collection information in HTML
            tags: [], // No tags information in HTML
            createdAt: new Date(),
            isPinned: false,
          })));
          setBookmarks([...bookmarks, ...importedBookmarks]);
        } catch (error) {
          console.error('Error importing bookmarks:', error);
          // TODO: Display error message to user
        }
      };
      reader.readAsText(file);
    }
    setIsDropdownOpen(false);
  };

  const handleExport = () => {
    const htmlString = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bookmarks</title>
      </head>
      <body>
        <ul>
          ${bookmarks.map((bookmark) => `
            <li>
              <a href="${bookmark.url}">${bookmark.title}</a>
            </li>
          `).join('')}
        </ul>
      </body>
      </html>
    `;
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'bookmarks.html';
    link.click();

    URL.revokeObjectURL(url);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <div className="w-96">
            <SearchBar />
          </div>

          <div className="relative flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>+ Add New</span>
            </motion.button>
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold p-2 rounded-lg ml-2"
              onClick={toggleDropdown}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-gray-950 rounded shadow-md">
                <div
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-green-500"
                  onClick={handleImport}
                >
                  Import
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-red-500"
                  onClick={handleExport}
                >
                  Export
                </div>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".json, .html"
          />
        </div>

        <Dashboard />
      </main>

      <AddBookmarkModal />
      <EditBookmarkModal />
      <AddCollectionModal />
    </div>
  );
}

export default App;
