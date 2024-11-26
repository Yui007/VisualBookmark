import React from 'react';
import { motion } from 'framer-motion';
import { Home, Bookmark, FolderOpen, Hash, Pin, Trash2 } from 'lucide-react';
import { useStore } from '../store';

export const Sidebar = () => {
  const { collections, activeView, setActiveView, toggleAddCollectionModal, deleteCollection, getAllTags } = useStore();
  const tags = getAllTags();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-gray-900 h-screen p-4 flex flex-col overflow-y-auto"
    >
      <div className="space-y-2">
        <SidebarItem
          icon={<Home size={20} />}
          text="Dashboard"
          active={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <SidebarItem
          icon={<Pin size={20} />}
          text="Pinned"
          active={activeView === 'pinned'}
          onClick={() => setActiveView('pinned')}
        />
        <SidebarItem
          icon={<Bookmark size={20} />}
          text="All Links"
          active={activeView === 'all'}
          onClick={() => setActiveView('all')}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 text-sm font-medium">Collections</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAddCollectionModal}
            className="text-gray-400 hover:text-white"
          >
            {/* <Plus size={16} /> */}
          </motion.button>
        </div>
        <div className="space-y-1">
          {collections.map((collection) => (
            <div key={collection.id} className="group flex items-center">
              <SidebarItem
                icon={<FolderOpen size={20} />}
                text={collection.name}
                active={activeView === collection.name}
                onClick={() => setActiveView(collection.name)}
                className="flex-1"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteCollection(collection.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-gray-400 text-sm font-medium mb-2">Tags</h3>
        <div className="space-y-1">
          {tags.map((tag) => (
            <SidebarItem
              key={tag}
              icon={<Hash size={20} />}
              text={tag}
              active={activeView === `tag:${tag}`}
              onClick={() => setActiveView(`tag:${tag}`)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SidebarItem = ({
  icon,
  text,
  active = false,
  onClick,
  className = '',
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer ${
      active
        ? 'bg-blue-600 text-white'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    } ${className}`}
  >
    {icon}
    <span className="text-sm font-medium">{text}</span>
  </motion.div>
);
