// app/types/project/index.ts
// Project-related types

export interface Project {
  id: string;                      // Database ID
  slug: string;                    // Primary identifier
  title: string;                   // Project title
  shortDescription: string;        // For dashboard/list view
  description: string;             // For detailed project header
  technologies: string[];          // Unified tech stack
  year: number;                    // Project completion year
  category: string;                // Project category
  demo?: string;                   // Optional demo URL or component name
  blog?: string;                   // Optional blog URL/slug
  published: boolean;              // Draft or published
  archived?: boolean;              // Soft delete - hidden but not deleted
  createdAt: Date;                 // Created timestamp
  updatedAt: Date;                 // Updated timestamp
}