import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { getFaviconUrl, getOgImageUrl, validateAndFormatUrl } from '../utils/screenshot';

export const AddBookmarkModal = () => {
  const { isAddModalOpen, toggleAddModal, addBookmark, collections } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    collection: collections[0]?.name || '',
    tags: '',
    wallpaper: '',
    favicon: '',
  });

  const handleUrlChange = async (url: string) => {
    setError(null);
    setFormData(prev => ({ ...prev, url }));
    
    if (!url) return;

    try {
      const formattedUrl = validateAndFormatUrl(url);
      setIsLoading(true);

      const [wallpaper, favicon] = await Promise.all([
        getOgImageUrl(formattedUrl),
        getFaviconUrl(formattedUrl)
      ]);

      setFormData(prev => ({
        ...prev,
        url: formattedUrl,
        wallpaper,
        favicon,
        title: prev.title || new URL(formattedUrl).hostname.replace('www.', '')
      }));
    } catch (error) {
      setError('Please enter a valid URL (e.g., example.com or https://example.com)');
      console.error('Invalid URL or failed to fetch preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          wallpaper: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedUrl = validateAndFormatUrl(formData.url);
      addBookmark({
        id: Date.now().toString(),
        ...formData,
        url: formattedUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: new Date(),
        isPinned: false,
      });
      setFormData({
        title: '',
        url: '',
        collection: collections[0]?.name || '',
        tags: '',
        wallpaper: '',
        favicon: '',
      });
    } catch (error) {
      setError('Please enter a valid URL before submitting');
    }
  };

  return (
    <AnimatePresence>
      {isAddModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Add New Bookmark</h2>
              <button
                onClick={toggleAddModal}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="example.com or https://example.com"
                    className={`w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                      error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    required
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 size={20} className="animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
                {error && (
                  <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Collection
                </label>
                <select
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.name}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., dev, tools, reference"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Preview Image
                </label>
                <motion.div
                  className={`relative rounded-lg overflow-hidden ${
                    isDragging ? 'border-2 border-blue-500' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {formData.wallpaper ? (
                    <div className="relative group">
                      <img
                        src={formData.wallpaper}
                        alt="Preview"
                        className="w-full h-48 object-contain bg-gray-900"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <Upload size={16} />
                          <span>Change Image</span>
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 bg-gray-700 hover:bg-gray-600 flex flex-col items-center justify-center space-y-2 transition-colors"
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <ImageIcon size={32} className="text-gray-400" />
                      </motion.div>
                      <p className="text-gray-400 text-sm">
                        Click or drag image to upload
                      </p>
                    </motion.button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-6"
              >
                Add Bookmark
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};