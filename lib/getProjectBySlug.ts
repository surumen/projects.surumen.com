import fs from 'fs'
import { join } from 'path';
import matter from 'gray-matter';
import { Project } from '@/types';

import { AllProjectsData } from '@/data/projects/AllProjectsData';

const projectsDirectory = join(process.cwd(), 'app/data/projects/md');

export function getProjectsSlugs(): string[] {
    try {
        return fs.readdirSync(projectsDirectory);
    } catch (error) {
        return [];
    }
}

export function getProjectBySlug(slug: string): Project | null {
    if (!slug) {
        return null;
    }

    const project = AllProjectsData.find(p => p.slug === slug);
    return project || null;
}

export function getProjectBlogBySlug(slug: string): string {
    if (!slug) {
        throw new Error('Slug is required');
    }

    const fullPath = join(projectsDirectory, `${slug}.md`);
    
    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { content } = matter(fileContents);
        
        if (!content || content.trim().length === 0) {
            return '';
        }
        
        return content;
    } catch (error: any) {
        if (error?.code === 'ENOENT') {
            throw new Error(`Blog file not found for slug: ${slug}`);
        }
        throw new Error(`Failed to read blog content for ${slug}: ${error?.message || 'Unknown error'}`);
    }
}

export function getAllProjects(): Project[] {
    return AllProjectsData.filter(project => project.slug); // Only return projects with valid slugs
}

