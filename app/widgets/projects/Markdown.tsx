// import node module libraries
import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownDisplayProps {
    content: string;
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ content }) => {
    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }: any) {
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            )
        },
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
    };

    return (
        <Fragment>
            <ReactMarkdown
                components={MarkdownComponents}
                remarkPlugins={[remarkGfm]}
            >
                {content}
            </ReactMarkdown>
        </Fragment>
    );
};

export default MarkdownDisplay;
