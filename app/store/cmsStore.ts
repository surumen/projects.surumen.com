import { create } from 'zustand';
import type { Project, BlogPost } from '@/types';

interface CMSStore {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  
  // Blog Posts (for current project)
  blogPosts: BlogPost[];
  currentBlogPost: BlogPost | null;
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Project Actions
  fetchProjects: () => Promise<void>;
  getProjectBySlug: (slug: string) => Promise<Project | null>;
  createProject: (project: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  
  // Batch Project Actions
  batchDeleteProjects: (projectIds: string[]) => Promise<void>;
  batchArchiveProjects: (projectIds: string[]) => Promise<void>;
  batchUnarchiveProjects: (projectIds: string[]) => Promise<void>;
  batchPublishProjects: (projectIds: string[]) => Promise<void>;
  batchUnpublishProjects: (projectIds: string[]) => Promise<void>;
  
  // Blog Post Actions (nested under projects)
  fetchProjectBlogPosts: (projectId: string) => Promise<void>;
  getProjectBlogPost: (projectId: string, postId: string) => Promise<BlogPost | null>;
  createBlogPost: (projectId: string, post: Partial<BlogPost>) => Promise<BlogPost | null>;
  updateBlogPost: (projectId: string, postId: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (projectId: string, postId: string) => Promise<void>;
  setCurrentBlogPost: (post: BlogPost | null) => void;
  
  // Utility
  clearError: () => void;
}

export const useCMSStore = create<CMSStore>((set, get) => ({
  // Initial State
  projects: [],
  currentProject: null,
  blogPosts: [],
  currentBlogPost: null,
  loading: false,
  error: null,

  // Project Actions
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projects = await response.json();
      set({ projects, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getProjectBySlug: async (slug: string) => {
    try {
      const response = await fetch(`/api/projects/slug/${slug}`);
      if (response.ok) {
        const project = await response.json();
        return project;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  createProject: async (projectData: Partial<Project>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      const newProject = await response.json();
      
      // Refresh projects list
      await get().fetchProjects();
      
      set({ loading: false });
      return newProject;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      
      // Refresh projects list
      await get().fetchProjects();
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteProject: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      // Refresh projects list
      await get().fetchProjects();
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setCurrentProject: (project: Project | null) => set({ currentProject: project }),

  // Batch Project Actions
  batchDeleteProjects: async (projectIds: string[]) => {
    if (projectIds.length === 0) return;
    
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/projects/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIds,
          action: 'delete'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete projects');
      }
      
      // Refresh projects list
      await get().fetchProjects();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  batchArchiveProjects: async (projectIds: string[]) => {
    if (projectIds.length === 0) return;
    
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/projects/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIds,
          action: 'archive'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to archive projects');
      }
      
      await get().fetchProjects();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  batchUnarchiveProjects: async (projectIds: string[]) => {
    if (projectIds.length === 0) return;
    
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/projects/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIds,
          action: 'unarchive'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to unarchive projects');
      }
      
      await get().fetchProjects();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  batchPublishProjects: async (projectIds: string[]) => {
    if (projectIds.length === 0) return;
    
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/projects/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIds,
          action: 'publish'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish projects');
      }
      
      await get().fetchProjects();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  batchUnpublishProjects: async (projectIds: string[]) => {
    if (projectIds.length === 0) return;
    
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/projects/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIds,
          action: 'unpublish'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to unpublish projects');
      }
      
      await get().fetchProjects();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Blog Post Actions
  fetchProjectBlogPosts: async (projectId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/blog`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const blogPosts = await response.json();
      set({ blogPosts, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getProjectBlogPost: async (projectId: string, postId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/blog/${postId}`);
      if (response.ok) {
        const post = await response.json();
        return post;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  createBlogPost: async (projectId: string, postData: Partial<BlogPost>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }
      
      const newPost = await response.json();
      
      // Refresh blog posts list
      await get().fetchProjectBlogPosts(projectId);
      
      set({ loading: false });
      return newPost;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateBlogPost: async (projectId: string, postId: string, updates: Partial<BlogPost>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }
      
      // Refresh blog posts list
      await get().fetchProjectBlogPosts(projectId);
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteBlogPost: async (projectId: string, postId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}/blog/${postId}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }
      
      // Refresh blog posts list
      await get().fetchProjectBlogPosts(projectId);
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setCurrentBlogPost: (post: BlogPost | null) => set({ currentBlogPost: post }),
  
  clearError: () => set({ error: null }),
}));