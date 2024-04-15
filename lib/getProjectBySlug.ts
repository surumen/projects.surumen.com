import fs from 'fs'
import { join } from 'path';
import matter from 'gray-matter';
import { Project } from '@/types';

import { AllProjectsData } from '@/data/projects/AllProjectsData';

const projectsDirectory = join(process.cwd(), 'app/data/projects/md');


export function getProjectsSlugs() {
    return fs.readdirSync(projectsDirectory)
}


export function getProjectBySlug(slug: string) {
    return AllProjectsData.filter(p => p.slug === slug)[0];
}

export function getProjectBlogBySlug(slug: string) {
    const realSlug = slug.replace(/\.md$/, '')
    const fullPath = join(projectsDirectory, `${realSlug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents);

    return content;
}

export function getAllProjects(): Project[] {
    // const slugs = getProjectsSlugs();
    // return slugs
    //     .map((slug) => getProjectBySlug(slug));
    return AllProjectsData;
}

