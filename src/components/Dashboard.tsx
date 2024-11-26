import React from 'react';
import { motion } from 'framer-motion';
import { Link, FolderOpen, Hash, Pin } from 'lucide-react';
import { useStore } from '../store';
import { BookmarkCard } from './BookmarkCard';
import { observer } from 'mobx-react-lite';

export const Dashboard = observer(() => {
  const { bookmarks, collections, activeView, getAllTags } = useStore();
  const tags = getAllTags();

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    if (activeView === 'dashboard') return true;
    if (activeView === 'pinned') return bookmark.isPinned;
    if (activeView === 'all') return true;
    if (activeView.startsWith('tag:')) {
      const tag = activeView.replace('tag:', '');
      return bookmark.tags.includes(tag);
    }
    return bookmark.collection === activeView;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-8"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {activeView.startsWith('tag:')
            ? `Tag: ${activeView.replace('tag:', '')}`
            : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
        </h1>
        <p className="text-gray-400">
          {activeView === 'dashboard'
            ? 'A brief overview of your data'
            : `Viewing ${activeView} bookmarks`}
        </p>
      </div>

      {activeView === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Link size={24} />}
            label="Links"
            value={bookmarks.length}
            color="blue"
          />
          <StatCard
            icon={<FolderOpen size={24} />}
            label="Collections"
            value={collections.length}
            color="purple"
          />
          <StatCard
            icon={<Hash size={24} />}
            label="Tags"
            value={tags.length}
            color="green"
          />
          <StatCard
            icon={<Pin size={24} />}
            label="Pinned"
            value={bookmarks.filter((b) => b.isPinned).length}
            color="yellow"
          />
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            {activeView === 'dashboard' ? 'Recent' : 'Bookmarks'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </section>
    </motion.div>
  );
});

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-gray-800 p-6 rounded-xl flex items-center space-x-4`}
  >
    <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  </motion.div>
);
