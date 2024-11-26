export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  wallpaper?: string;
  collection: string;
  tags: string[];
  createdAt: Date;
  isPinned: boolean;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: Date;
}