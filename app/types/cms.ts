export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;         // Markdown with custom components
  excerpt: string;
  projectSlug?: string;    // Link to project
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CMSSettings {
  blogEnabled: boolean;
  hasContent: boolean;
  contentType: 'rich' | 'simple' | 'none';
}

export interface CustomComponent {
  name: string;
  props: Record<string, any>;
  children?: string;
}

export interface ParsedComponent {
  type: 'markdown' | 'component';
  content?: string;
  component?: CustomComponent;
}
