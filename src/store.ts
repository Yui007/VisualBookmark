import { create } from 'zustand';
import { Bookmark, Collection } from './types';

interface BookmarkStore {
  bookmarks: Bookmark[];
  collections: Collection[];
  activeView: 'dashboard' | 'pinned' | 'all' | string;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isAddCollectionModalOpen: boolean;
  searchTerm: string;
  editingBookmark: Bookmark | undefined;
  addBookmark: (bookmark: Bookmark) => void;
  editBookmark: (id: string, bookmark: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  togglePin: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setActiveView: (view: string) => void;
  toggleAddModal: () => void;
  toggleEditModal: (bookmark?: Bookmark) => void;
  toggleAddCollectionModal: () => void;
  addCollection: (name: string) => void;
  deleteCollection: (id: string) => void;
  getAllTags: () => string[];
  setBookmarks: (bookmarks: Bookmark[]) => void;
}

const demoBookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    favicon: 'https://github.com/favicon.ico',
    wallpaper: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb',
    collection: 'Development',
    tags: ['dev', 'code'],
    createdAt: new Date(),
    isPinned: true,
  },
  {
    id: '2',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    favicon: 'https://stackoverflow.com/favicon.ico',
    wallpaper: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
    collection: 'Development',
    tags: ['dev', 'help'],
    createdAt: new Date(),
    isPinned: false,
  },
];

const initialCollections: Collection[] = [
  { id: '1', name: 'Development', createdAt: new Date() },
  { id: '2', name: 'Personal', createdAt: new Date() },
  { id: '3', name: 'Work', createdAt: new Date() },
];

export const useStore = create<BookmarkStore>((set, get) => ({
  bookmarks: (() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    return storedBookmarks ? JSON.parse(storedBookmarks) : demoBookmarks;
  })(),
  collections: initialCollections,
  activeView: 'dashboard',
  isAddModalOpen: false,
  isEditModalOpen: false,
  isAddCollectionModalOpen: false,
  searchTerm: '',
  editingBookmark: undefined,
  addBookmark: (bookmark) =>
    set((state) => {
      const updatedBookmarks = [...state.bookmarks, bookmark];
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      set({ bookmarks: updatedBookmarks }); // Update state and trigger re-render
      return {
        isAddModalOpen: false,
      };
    }),
  editBookmark: (id, updatedFields) =>
    set((state) => {
      const updatedBookmarks = state.bookmarks.map((b) =>
        b.id === id ? { ...b, ...updatedFields } : b
      );
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      set({ bookmarks: updatedBookmarks }); // Update state and trigger re-render
      return {
        isEditModalOpen: false,
        editingBookmark: undefined,
      };
    }),
  deleteBookmark: (id) =>
    set((state) => {
      const updatedBookmarks = state.bookmarks.filter((b) => b.id !== id);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      set({ bookmarks: updatedBookmarks }); // Update state and trigger re-render
      return {};
    }),
  togglePin: (id) =>
    set((state) => {
      const updatedBookmarks = state.bookmarks.map((b) =>
        b.id === id ? { ...b, isPinned: !b.isPinned } : b
      );
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      set({ bookmarks: updatedBookmarks }); // Update state and trigger re-render
      return {};
    }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setActiveView: (view) => set({ activeView: view }),
  toggleAddModal: () => set((state) => ({ isAddModalOpen: !state.isAddModalOpen })),
  toggleEditModal: (bookmark = undefined) =>
    set((state) => ({
      isEditModalOpen: !state.isEditModalOpen,
      editingBookmark: bookmark,
    })),
  toggleAddCollectionModal: () =>
    set((state) => ({ isAddCollectionModalOpen: !state.isAddCollectionModalOpen })),
  addCollection: (name) =>
    set((state) => ({
      collections: [...state.collections, {
        id: Date.now().toString(),
        name,
        createdAt: new Date(),
      }],
      isAddCollectionModalOpen: false,
    })),
  deleteCollection: (id) =>
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
      bookmarks: state.bookmarks.filter((b) =>
        b.collection !== state.collections.find((c) => c.id === id)?.name
      ),
      activeView: 'dashboard',
    })),
  getAllTags: () => {
    const tags = new Set<string>();
    get().bookmarks.forEach((bookmark) => {
      bookmark.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  },
  setBookmarks: (bookmarks) => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    set({ bookmarks }); // Update state and trigger re-render
  },
}));
