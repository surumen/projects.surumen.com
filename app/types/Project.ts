
export interface Project {
    id: string;
    language: string;
    technologyAreas: string[];
    title: string;
    shortTitle?: string;
    slug?: string;
    shortDescription: string;
    description: string;
    contentType: string;
    content: string;

    status?: string;
    level?: string;
    image?: string;
    duration?: string;
    rating?: any;
}