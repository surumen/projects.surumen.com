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
    const realSlug = slug.replace(/\.md$/, '')
    const fullPath = join(projectsDirectory, `${realSlug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents);

    let project: Project = AllProjectsData.filter(p => p.slug === realSlug)[0];

    // project.slug = realSlug;
    // project.content = content;

    return project;
}

export function getAllProjects(): Project[] {
    const slugs = getProjectsSlugs();
    return slugs
        .map((slug) => getProjectBySlug(slug));
}

