import React from 'react';
import { motion } from 'framer-motion';
import { Pin, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useStore } from '../store';
import { Bookmark } from '../types';

export const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  const { togglePin, toggleEditModal, deleteBookmark } = useStore();

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
      className="bg-gray-800 rounded-lg overflow-hidden"
    >
      {bookmark.wallpaper && (
        <div className="relative h-32 w-full overflow-hidden">
          <img
            src={bookmark.wallpaper}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 p-2"
            >
              <ExternalLink size={24} />
            </a>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {bookmark.favicon && (
              <img src={bookmark.favicon} alt="" className="w-8 h-8 rounded" />
            )}
            <div>
              <h3 className="text-white font-medium">{bookmark.title}</h3>
              <p className="text-gray-400 text-sm">{bookmark.url}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {bookmark.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => togglePin(bookmark.id)}
              initial={{ scale: bookmark.isPinned ? 1.1 : 1 }}
              animate={{ scale: bookmark.isPinned ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              className={`text-white hover:text-yellow-500 ${
                bookmark.isPinned ? 'text-yellow-500' : ''
              }`}
            >
              <Pin size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, translateY: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              onClick={() => toggleEditModal(bookmark)}
              className="text-white hover:text-blue-500"
            >
              <Edit2 size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, translateY: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-white hover:text-red-500"
            >
              <Trash2 size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
