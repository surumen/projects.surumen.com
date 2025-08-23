import React, { useState, useRef } from 'react';
import type { Editor } from '@tiptap/core';
import ToolbarModal from './ToolbarModal';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, editor }) => {
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setUrl('');
      setAltText('');
      setWidth('');
      setHeight('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-generate alt text from filename
      const filename = file.name.split('.')[0];
      setAltText(filename.replace(/[-_]/g, ' '));
    }
  };

  const handleSubmit = async () => {
    let imageUrl = '';

    if (imageSource === 'url') {
      if (!url) return;
      imageUrl = url;
    } else {
      if (!selectedFile) return;
      
      // Convert file to data URL for preview
      // In a real app, you'd upload to your server first
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        insertImage(dataUrl);
      };
      reader.readAsDataURL(selectedFile);
      return;
    }

    insertImage(imageUrl);
  };

  const insertImage = (src: string) => {
    const attrs: any = { src, alt: altText || '' };
    
    if (width) attrs.width = width;
    if (height) attrs.height = height;

    // Insert image as HTML since setImage might not be available
    const imgHtml = `<img src="${src}" alt="${altText || ''}"${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''} />`;
    editor.chain().focus().insertContent(imgHtml).run();
    onClose();
  };

  const isValid = imageSource === 'url' ? !!url : !!selectedFile;

  return (
    <ToolbarModal
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Image"
      onSubmit={handleSubmit}
      submitText="Insert Image"
      size="lg"
    >
      {/* Image Source Selection */}
      <div className="mb-3">
        <label className="form-label">Image Source</label>
        <div className="btn-group w-100" role="group">
          <input
            type="radio"
            className="btn-check"
            name="imageSource"
            id="source-url"
            checked={imageSource === 'url'}
            onChange={() => setImageSource('url')}
          />
          <label className="btn btn-outline-primary" htmlFor="source-url">
            URL
          </label>

          <input
            type="radio"
            className="btn-check"
            name="imageSource"
            id="source-upload"
            checked={imageSource === 'upload'}
            onChange={() => setImageSource('upload')}
          />
          <label className="btn btn-outline-primary" htmlFor="source-upload">
            Upload
          </label>
        </div>
      </div>

      {/* URL Input */}
      {imageSource === 'url' && (
        <div className="mb-3">
          <label htmlFor="image-url" className="form-label">
            Image URL <span className="text-danger">*</span>
          </label>
          <input
            id="image-url"
            type="url"
            className="form-control"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoFocus
          />
        </div>
      )}

      {/* File Upload */}
      {imageSource === 'upload' && (
        <div className="mb-3">
          <label htmlFor="image-file" className="form-label">
            Choose Image <span className="text-danger">*</span>
          </label>
          <input
            id="image-file"
            ref={fileInputRef}
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <div className="form-text text-success">
              Selected: {selectedFile.name}
            </div>
          )}
        </div>
      )}

      {/* Alt Text */}
      <div className="mb-3">
        <label htmlFor="image-alt" className="form-label">
          Alt Text
        </label>
        <input
          id="image-alt"
          type="text"
          className="form-control"
          placeholder="Descriptive text for screen readers"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
        <div className="form-text">
          Important for accessibility and SEO
        </div>
      </div>

      {/* Dimensions */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="image-width" className="form-label">
              Width (px)
            </label>
            <input
              id="image-width"
              type="number"
              className="form-control"
              placeholder="Auto"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min="1"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="image-height" className="form-label">
              Height (px)
            </label>
            <input
              id="image-height"
              type="number"
              className="form-control"
              placeholder="Auto"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      {((imageSource === 'url' && url) || (imageSource === 'upload' && selectedFile)) && (
        <div className="mb-3">
          <label className="form-label">Preview</label>
          <div className="border rounded p-3 text-center bg-light">
            {imageSource === 'url' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={altText || 'Image preview'}
                style={{ maxWidth: '100%', maxHeight: '200px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : selectedFile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(selectedFile)}
                alt={altText || 'Image preview'}
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            ) : null}
          </div>
        </div>
      )}

      {!isValid && (
        <div className="alert alert-warning">
          Please {imageSource === 'url' ? 'enter an image URL' : 'select an image file'}
        </div>
      )}
    </ToolbarModal>
  );
};

export default ImageModal;
