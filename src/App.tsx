import React from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { EditBookmarkModal } from './components/EditBookmarkModal';
import { AddCollectionModal } from './components/AddCollectionModal';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from './store';

function App() {
  const { toggleAddModal } = useStore();

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <div className="w-96">
            <SearchBar />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add New</span>
          </motion.button>
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