
export interface Project {
    id: string;
    languages: string[];
    frameworks: string[];
    technologyAreas: string[];
    title: string;
    shortTitle?: string;
    slug?: string;
    shortDescription: string;
    description: string;
    content: string;
    hasDemo: boolean;
    hasBlog: boolean;

    completed?: string;
    status?: string;
    level?: string;
    image?: string;
    duration?: string;
    rating?: any;
}