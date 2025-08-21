import React from 'react';

// Import simple demo component to avoid dependency issues
import DemoComponent from '@/widgets/components/DemoComponent';

// Create wrapper components for demonstration
const ProjectDemo: React.FC<any> = (props) => (
  <DemoComponent componentName="ProjectDemo" {...props} />
);

const RacingBarChart: React.FC<any> = (props) => (
  <DemoComponent componentName="RacingBarChart" {...props} />
);

const PlayerFormation: React.FC<any> = (props) => (
  <DemoComponent componentName="PlayerFormation" {...props} />
);

const Pitch: React.FC<any> = (props) => (
  <DemoComponent componentName="Pitch" {...props} />
);

const BracketComponent: React.FC<any> = (props) => (
  <DemoComponent componentName="Bracket" {...props} />
);

const CodeSnippet: React.FC<any> = (props) => (
  <div className="border rounded p-3 my-3 bg-dark text-light">
    <div className="d-flex align-items-center mb-2">
      <i className="bi bi-code-slash text-info me-2"></i>
      <strong>Code Snippet</strong>
      {props.language && <span className="badge bg-info ms-2">{props.language}</span>}
      {props.filename && <span className="small text-muted ms-2">{props.filename}</span>}
    </div>
    <pre className="mb-0">
      <code>{props.children || '// Your code here...'}</code>
    </pre>
  </div>
);

export const componentRegistry: Record<string, React.ComponentType<any>> = {
  // Project components
  'ProjectDemo': ProjectDemo,
  
  // Chart components
  'RacingBarChart': RacingBarChart,
  'ChartWidget': RacingBarChart,
  
  // Football components
  'PlayerFormation': PlayerFormation,
  'Pitch': Pitch,
  
  // Bracket components
  'Bracket': BracketComponent,
  
  // Code components
  'CodeSnippet': CodeSnippet,
  
  // Generic demo component
  'DemoComponent': DemoComponent,
};

export type ComponentName = keyof typeof componentRegistry;

export function getComponent(name: string): React.ComponentType<any> | null {
  return componentRegistry[name] || null;
}

export function isValidComponent(name: string): boolean {
  return name in componentRegistry;
}
