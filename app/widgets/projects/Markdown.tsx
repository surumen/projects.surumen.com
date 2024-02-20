// import node module libraries
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import rangeParser from 'parse-numeric-range';
import { oneDark, prism, materialLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';


SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);

const MarkdownDisplay = ({ content }) => {

    const syntaxTheme = prism;

    const MarkdownComponents: object = {
        code({ node, inline, className, ...props }) {
            const hasLang = /language-(\w+)/.exec(className || '');
            const hasMeta = node?.data?.meta;

            const applyHighlights: object = (applyHighlights: number) => {
                if (hasMeta) {
                    const RE = /{([\d,-]+)}/;
                    const metadata = node.data.meta?.replace(/\s/g, '');
                    // @ts-ignore
                    const strlineNumbers = RE?.test(metadata) ? RE?.exec(metadata)[1] : '0';
                    const highlightLines = rangeParser(strlineNumbers);
                    const highlight = highlightLines;
                    const data: string | null = highlight.includes(applyHighlights) ? 'highlight' : null;
                    return { data };
                } else {
                    return {};
                }
            };

            return hasLang ? (
                <SyntaxHighlighter
                    style={syntaxTheme}
                    language={hasLang[1]}
                    PreTag='div'
                    className='codeStyle'
                    showLineNumbers={true}
                    wrapLines={hasMeta}
                    useInlineStyles={true}
                    lineProps={applyHighlights}
                >
                    {props.children}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props} />
            )
        },
        h1: 'h2',
        h2(props) {
            const {node, ...rest} = props;
            const headerName = props.children ? props.children.toLocaleString() : '';
            return <h2 className='border-bottom'
                       id={headerName.replace(/ /g,'-').toLowerCase()}
            >{props.children}</h2>
        },
        a(props) {
            const {node, ...rest} = props;
            return <a href={props.href} target='_blank'>{props.children}</a>
        }
    }

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

// Typechecking With PropTypes
MarkdownDisplay.propTypes = {
    content: PropTypes.string.isRequired
};

export default MarkdownDisplay;
