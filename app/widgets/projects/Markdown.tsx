// Enhanced Markdown component with custom component support
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseCustomComponents, getComponent, isValidComponent } from '../../../lib/cms/markdown';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ content, className = '' }) => {
  // Parse custom components in the markdown
  const processedContent = parseCustomComponents(content);
  
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom component renderer
          div: ({ node, className, children, ...props }: any) => {
            if (className?.includes('custom-component')) {
              const componentName = props['data-component'] as string;
              const componentPropsStr = props['data-props'] as string;
              
              if (componentName && isValidComponent(componentName)) {
                try {
                  const componentProps = componentPropsStr ? JSON.parse(componentPropsStr) : {};
                  const Component = getComponent(componentName);
                  
                  if (Component) {
                    return <Component {...componentProps} />;
                  }
                } catch (error) {
                  console.error('Error parsing component props:', error);
                  return (
                    <div className="alert alert-warning">
                      <strong>Component Error:</strong> Failed to render {componentName}
                    </div>
                  );
                }
              }
              
              return (
                <div className="alert alert-info">
                  <strong>Unknown Component:</strong> {componentName}
                </div>
              );
            }
            
            return <div className={className} {...props}>{children}</div>;
          },
          
          // Enhanced code blocks with syntax highlighting
          code: ({ node, className, children, ...props }: any) => {
            const inline = props.inline;
            if (inline) {
              return <code className="bg-light px-1 rounded" {...props}>{children}</code>;
            }
            
            return (
              <pre className="bg-dark text-light p-3 rounded">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          
          // Enhanced blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-start border-primary border-3 ps-3 fst-italic text-muted">
              {children}
            </blockquote>
          ),
          
          // Header anchors (preserved from original)
          h1: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
          h2(props: any) {
            const { node, children, ...rest } = props;
            const headerName = children ? String(children) : '';
            const anchorId = headerName.replace(/ /g, '-').toLowerCase();
            
            return (
              <h2 
                className='border-bottom'
                id={anchorId}
                {...rest}
              >
                {children}
              </h2>
            );
          },
          
          // External links (preserved from original)
          a(props: any) {
            const { node, href, children, ...rest } = props;
            return (
              <a 
                href={href} 
                target='_blank' 
                rel='noopener noreferrer'
                {...rest}
              >
                {children}
              </a>
            );
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
