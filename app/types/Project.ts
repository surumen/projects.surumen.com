
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
    contentType: string;
    content: string;
    hasWriteUp: boolean;

    completed?: string;
    component?: any;
    status?: string;
    level?: string;
    image?: string;
    duration?: string;
    rating?: any;
}