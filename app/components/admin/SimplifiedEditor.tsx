import React, { useState, useRef } from 'react';
import { Form, Button, ButtonGroup, Dropdown } from 'react-bootstrap';

interface SimplifiedEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function SimplifiedEditor({ content, onChange, placeholder }: SimplifiedEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const newContent = content.substring(0, startPos) + textToInsert + content.substring(endPos);
    
    onChange(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + textToInsert.length, startPos + textToInsert.length);
    }, 0);
  };

  const formatText = (beforeText: string, afterText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = content.substring(startPos, endPos);
    
    let formattedText;
    if (selectedText) {
      formattedText = beforeText + selectedText + afterText;
    } else {
      formattedText = beforeText + 'text' + afterText;
    }
    
    const newContent = content.substring(0, startPos) + formattedText + content.substring(endPos);
    onChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(startPos + beforeText.length, startPos + beforeText.length + selectedText.length);
      } else {
        textarea.setSelectionRange(startPos + beforeText.length, startPos + beforeText.length + 4); // Select 'text'
      }
    }, 0);
  };

  const insertHeading = (level: number) => {
    const hashes = '#'.repeat(level);
    insertAtCursor(`\n${hashes} Heading ${level}\n\n`);
  };

  const insertComponent = (componentType: string) => {
    const components = {
      'ProjectDemo': '<ProjectDemo projectSlug="your-project-slug" type="interactive" />',
      'CodeSnippet': '<CodeSnippet language="javascript" filename="example.js">\n// Your code here\nconsole.log("Hello World!");\n</CodeSnippet>',
      'RacingBarChart': '<RacingBarChart data="your-data" animated="true" />',
      'PlayerFormation': '<PlayerFormation formation="4-3-3" team="Your Team" />',
      'Bracket': '<Bracket tournament="Tournament Name" round="Final" />'
    };
    
    insertAtCursor(`\n\n${components[componentType]}\n\n`);
  };

  return (
    <div className="simplified-editor border rounded">
      {/* Enhanced Toolbar */}
      <div className="d-flex flex-wrap align-items-center p-2 bg-light border-bottom">
        {/* Text Formatting */}
        <ButtonGroup size="sm" className="me-2 mb-1">
          <Button 
            variant="outline-secondary" 
            onClick={() => formatText('**', '**')}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => formatText('*', '*')}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => formatText('`', '`')}
            title="Inline Code"
          >
            {'</>'}
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => formatText('~~', '~~')}
            title="Strikethrough"
          >
            <span style={{ textDecoration: 'line-through' }}>S</span>
          </Button>
        </ButtonGroup>

        {/* Headings */}
        <Dropdown as={ButtonGroup} size="sm" className="me-2 mb-1">
          <Button variant="outline-secondary" onClick={() => insertHeading(2)}>
            H2
          </Button>
          <Dropdown.Toggle 
            split 
            variant="outline-secondary" 
            id="heading-dropdown"
          />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => insertHeading(1)}>H1 - Main Heading</Dropdown.Item>
            <Dropdown.Item onClick={() => insertHeading(2)}>H2 - Section</Dropdown.Item>
            <Dropdown.Item onClick={() => insertHeading(3)}>H3 - Subsection</Dropdown.Item>
            <Dropdown.Item onClick={() => insertHeading(4)}>H4 - Minor Heading</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Lists and Content */}
        <ButtonGroup size="sm" className="me-2 mb-1">
          <Button 
            variant="outline-secondary" 
            onClick={() => insertAtCursor('\n- List item\n- Another item\n\n')}
            title="Bullet List"
          >
            • List
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => insertAtCursor('\n1. First item\n2. Second item\n\n')}
            title="Numbered List"
          >
            1. List
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => insertAtCursor('\n> This is a blockquote\n\n')}
            title="Blockquote"
          >
            💬 Quote
          </Button>
        </ButtonGroup>

        {/* Links and Media */}
        <ButtonGroup size="sm" className="me-2 mb-1">
          <Button 
            variant="outline-secondary" 
            onClick={() => insertAtCursor('[Link Text](https://example.com)')}
            title="Insert Link"
          >
            🔗 Link
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => insertAtCursor('\n```javascript\n// Your code here\nconsole.log("Hello!");\n```\n\n')}
            title="Code Block"
          >
            📝 Code
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => insertAtCursor('\n| Column 1 | Column 2 |\n|----------|----------|\n| Data 1   | Data 2   |\n\n')}
            title="Insert Table"
          >
            📊 Table
          </Button>
        </ButtonGroup>

        {/* Custom Components */}
        <Dropdown as={ButtonGroup} size="sm" className="me-2 mb-1">
          <Button 
            variant="outline-primary" 
            onClick={() => insertComponent('ProjectDemo')}
          >
            🎮 Components
          </Button>
          <Dropdown.Toggle 
            split 
            variant="outline-primary" 
            id="components-dropdown"
          />
          <Dropdown.Menu>
            <Dropdown.Header>Project Components</Dropdown.Header>
            <Dropdown.Item onClick={() => insertComponent('ProjectDemo')}>
              🎮 Project Demo
            </Dropdown.Item>
            <Dropdown.Item onClick={() => insertComponent('RacingBarChart')}>
              📊 Racing Bar Chart
            </Dropdown.Item>
            <Dropdown.Item onClick={() => insertComponent('Bracket')}>
              🏆 Tournament Bracket
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Content Components</Dropdown.Header>
            <Dropdown.Item onClick={() => insertComponent('CodeSnippet')}>
              💻 Code Snippet
            </Dropdown.Item>
            <Dropdown.Item onClick={() => insertComponent('PlayerFormation')}>
              ⚽ Player Formation
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Source Mode */}
        <Button 
          size="sm"
          variant={isSourceMode ? "success" : "outline-secondary"}
          onClick={() => setIsSourceMode(!isSourceMode)}
          title="Toggle Source Mode"
          className="mb-1"
        >
          {isSourceMode ? '✅ Source' : '<> Source'}
        </Button>
      </div>

      {/* Editor Area */}
      <div className="position-relative">
        <Form.Control
          ref={textareaRef}
          as="textarea"
          rows={18}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Start writing your blog post...'}
          style={{ 
            fontFamily: isSourceMode ? '"Monaco", "Menlo", "Ubuntu Mono", monospace' : '"Inter", -apple-system, sans-serif',
            fontSize: isSourceMode ? '13px' : '14px',
            lineHeight: isSourceMode ? '1.4' : '1.6',
            border: 'none',
            borderRadius: 0,
            resize: 'vertical',
            minHeight: '400px'
          }}
          onKeyDown={(e) => {
            // Keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
              if (e.key === 'b') {
                e.preventDefault();
                formatText('**', '**');
              } else if (e.key === 'i') {
                e.preventDefault();
                formatText('*', '*');
              }
            }
          }}
        />
        
        {/* Character count overlay */}
        <div 
          className="position-absolute text-muted small"
          style={{ 
            bottom: '10px', 
            right: '15px', 
            background: 'rgba(255,255,255,0.9)',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '11px'
          }}
        >
          {content.length} chars
        </div>
      </div>

      {/* Help Footer */}
      <div className="p-2 bg-light border-top">
        <div className="row">
          <div className="col-md-8">
            <small className="text-muted">
              <strong>💡 Tips:</strong> Select text and click formatting buttons. Use dropdowns for headings and components. 
              {isSourceMode ? ' You\'re in source mode - edit markdown directly.' : ' Toggle source mode to see markdown.'}
            </small>
          </div>
          <div className="col-md-4 text-end">
            <small className="text-muted">
              <kbd>Ctrl+B</kbd> Bold • <kbd>Ctrl+I</kbd> Italic
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
