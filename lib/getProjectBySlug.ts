import { Project } from '../app/types';
import { AllProjectsData } from '../app/data/projects/AllProjectsData';

export function getProjectsSlugs(): string[] {
    return AllProjectsData.map(project => project.slug);
}

export function getProjectBySlug(slug: string): Project | null {
    if (!slug) {
        return null;
    }

    const project = AllProjectsData.find(p => p.slug === slug);
    return project || null;
}

export async function getProjectBlogBySlug(slug: string): Promise<string | null> {
    if (!slug) {
        return null;
    }

    try {
        // Check if we're in a server environment (no Firebase client SDK on server)
        if (typeof window === 'undefined') {
            // Server-side: use admin SDK
            const { adminDb } = await import('./firebase/admin');
            
            const postsRef = adminDb.collection('posts');
            const querySnapshot = await postsRef
                .where('projectSlug', '==', slug)
                .where('published', '==', true)
                .limit(1)
                .get();
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const post = doc.data();
                return post.content || '';
            }
        } else {
            // Client-side: use client SDK
            const { db } = await import('./firebase/config');
            const { collection, query, where, getDocs, limit } = await import('firebase/firestore');
            
            const postsRef = collection(db, 'posts');
            const q = query(
                postsRef, 
                where('projectSlug', '==', slug), 
                where('published', '==', true),
                limit(1)
            );
            
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const post = doc.data();
                return post.content || '';
            }
        }
        
        return null; // No content found
    } catch (error) {
        console.error('Failed to fetch blog content:', error);
        return null;
    }
}

export function getAllProjects(): Project[] {
    return AllProjectsData.filter(project => project.slug);
}

