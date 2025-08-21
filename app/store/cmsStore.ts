import { create } from 'zustand';
import { BlogPost } from '../types/cms';

interface CMSStore {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPosts: () => Promise<void>;
  getPostBySlug: (slug: string) => Promise<BlogPost | null>;
  createPost: (post: Partial<BlogPost>) => Promise<BlogPost | null>;
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  setCurrentPost: (post: BlogPost | null) => void;
  clearError: () => void;
}

export const useCMSStore = create<CMSStore>((set, get) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const posts = await response.json();
      set({ posts, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getPostBySlug: async (slug: string) => {
    try {
      const response = await fetch(`/api/posts/slug/${slug}`);
      if (response.ok) {
        const post = await response.json();
        return post;
      }
      return null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  },

  createPost: async (postData: Partial<BlogPost>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      const newPost = await response.json();
      
      // Refresh posts list
      await get().fetchPosts();
      
      set({ loading: false });
      return newPost;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updatePost: async (id: string, updates: Partial<BlogPost>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      
      // Refresh posts list
      await get().fetchPosts();
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deletePost: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/posts/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      // Refresh posts list
      await get().fetchPosts();
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setCurrentPost: (post: BlogPost | null) => set({ currentPost: post }),
  
  clearError: () => set({ error: null }),
}));
