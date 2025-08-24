export interface BlogPost {
  id: string;
  projectId: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
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