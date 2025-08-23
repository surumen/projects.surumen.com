import React, { useState } from 'react';
import type { Editor } from '@tiptap/core';
import ToolbarModal from './ToolbarModal';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor;
}

const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose, editor }) => {
  const [embedType, setEmbedType] = useState<'youtube' | 'vimeo' | 'iframe' | 'code'>('youtube');
  const [url, setUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [width, setWidth] = useState('560');
  const [height, setHeight] = useState('315');

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setUrl('');
      setEmbedCode('');
      setWidth('560');
      setHeight('315');
    }
  }, [isOpen]);

  // Extract video ID from URL
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getVimeoId = (url: string): string | null => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const generateEmbedHtml = (): string => {
    switch (embedType) {
      case 'youtube':
        const ytId = getYouTubeId(url);
        if (!ytId) return '';
        return `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${ytId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      
      case 'vimeo':
        const vimeoId = getVimeoId(url);
        if (!vimeoId) return '';
        return `<iframe src="https://player.vimeo.com/video/${vimeoId}" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      
      case 'iframe':
        if (!url) return '';
        return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0"></iframe>`;
      
      case 'code':
        return embedCode;
      
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    const html = generateEmbedHtml();
    if (!html) return;

    // Insert as HTML content
    editor.chain().focus().insertContent(html).run();
    onClose();
  };

  const previewHtml = generateEmbedHtml();
  const isValid = embedType === 'code' ? !!embedCode : !!url;

  return (
    <ToolbarModal
      isOpen={isOpen}
      onClose={onClose}
      title="Embed Media"
      onSubmit={handleSubmit}
      submitText="Insert Embed"
      size="lg"
    >
      {/* Embed Type Selection */}
      <div className="mb-3">
        <label className="form-label">Embed Type</label>
        <select 
          className="form-select" 
          value={embedType} 
          onChange={(e) => setEmbedType(e.target.value as any)}
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="iframe">Generic iframe</option>
          <option value="code">Custom HTML</option>
        </select>
      </div>

      {/* URL Input */}
      {embedType !== 'code' && (
        <div className="mb-3">
          <label htmlFor="embed-url" className="form-label">
            URL <span className="text-danger">*</span>
          </label>
          <input
            id="embed-url"
            type="url"
            className="form-control"
            placeholder={
              embedType === 'youtube' 
                ? 'https://www.youtube.com/watch?v=...'
                : embedType === 'vimeo'
                ? 'https://vimeo.com/...'
                : 'https://example.com'
            }
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoFocus
          />
          {embedType === 'youtube' && (
            <div className="form-text">
              Paste any YouTube URL (watch, share, or embed format)
            </div>
          )}
          {embedType === 'vimeo' && (
            <div className="form-text">
              Paste any Vimeo URL
            </div>
          )}
        </div>
      )}

      {/* Custom HTML Code */}
      {embedType === 'code' && (
        <div className="mb-3">
          <label htmlFor="embed-code" className="form-label">
            Embed Code <span className="text-danger">*</span>
          </label>
          <textarea
            id="embed-code"
            className="form-control"
            rows={6}
            placeholder="<iframe src=&quot;...&quot;></iframe>"
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            autoFocus
          />
          <div className="form-text">
            Paste embed code from any platform (YouTube, Twitter, CodePen, etc.)
          </div>
        </div>
      )}

      {/* Dimensions */}
      {embedType !== 'code' && (
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="embed-width" className="form-label">
                Width (px)
              </label>
              <input
                id="embed-width"
                type="number"
                className="form-control"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="100"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="embed-height" className="form-label">
                Height (px)
              </label>
              <input
                id="embed-height"
                type="number"
                className="form-control"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewHtml && (
        <div className="mb-3">
          <label className="form-label">Preview</label>
          <div className="border rounded p-3 bg-light">
            <div 
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              style={{ pointerEvents: 'none' }} // Disable interactions in preview
            />
          </div>
        </div>
      )}

      {/* Generated HTML Code */}
      {previewHtml && embedType !== 'code' && (
        <div className="mb-3">
          <label className="form-label">Generated HTML</label>
          <textarea
            className="form-control"
            rows={3}
            value={previewHtml}
            readOnly
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
        </div>
      )}

      {/* Validation Warning */}
      {!isValid && (
        <div className="alert alert-warning">
          Please {embedType === 'code' ? 'enter embed code' : 'enter a valid URL'}
        </div>
      )}

      {/* URL Format Error */}
      {embedType === 'youtube' && url && !getYouTubeId(url) && (
        <div className="alert alert-danger">
          Invalid YouTube URL format
        </div>
      )}

      {embedType === 'vimeo' && url && !getVimeoId(url) && (
        <div className="alert alert-danger">
          Invalid Vimeo URL format
        </div>
      )}
    </ToolbarModal>
  );
};

export default EmbedModal;
