import React, { useState, useRef, useCallback } from 'react';
import { Form, ProgressBar, Alert, Button, Badge } from 'react-bootstrap';
import { CloudUpload, X, FileEarmark, Image } from 'react-bootstrap-icons';
import { FileUploadFieldConfig } from '@/types/forms/advanced';

interface FileUploadFieldProps {
  field: FileUploadFieldConfig;
  value: File | File[] | string | string[];
  error?: string;
  touched: boolean;
  onChange: (value: File | File[] | null) => void;
  onBlur: () => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasError = touched && !!error;
  const groupClass = `mb-3 ${field.styling?.customClasses?.group || ''}`.trim();
  const labelClass = field.styling?.customClasses?.label || '';

  // Get current files array
  const currentFiles: File[] = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.filter(f => f instanceof File) as File[];
    }
    return value instanceof File ? [value] : [];
  }, [value]);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (field.maxSize && file.size > field.maxSize) {
      return `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(field.maxSize)})`;
    }

    // Check file type
    if (field.accept) {
      const acceptedTypes = field.accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(acceptedType => {
        if (acceptedType.startsWith('.')) {
          return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
        }
        if (acceptedType.includes('*')) {
          const baseType = acceptedType.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === acceptedType;
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed types: ${field.accept}`;
      }
    }

    return null;
  }, [field.accept, field.maxSize, formatFileSize]);

  // Simulate file upload (replace with real upload logic)
  const simulateUpload = useCallback((file: File) => {
    if (!field.uploadUrl) return;

    const fileName = file.name;
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      setUploadProgress(prev => ({
        ...prev,
        [fileName]: progress
      }));

      if (field.onUploadProgress) {
        field.onUploadProgress(progress);
      }
    }, 200);
  }, [field]);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    // Check max files limit
    const totalFiles = currentFiles.length + validFiles.length;
    if (field.maxFiles && totalFiles > field.maxFiles) {
      errors.push(`Maximum ${field.maxFiles} files allowed`);
      return;
    }

    // Show validation errors
    if (errors.length > 0) {
      console.warn('File validation errors:', errors);
      // In a real implementation, you might want to show these errors in the UI
      return;
    }

    // Update value
    if (field.multiple) {
      const newFiles = [...currentFiles, ...validFiles];
      onChange(newFiles);
    } else {
      onChange(validFiles[0] || null);
    }

    // Simulate upload progress (replace with actual upload logic)
    if (field.uploadUrl) {
      validFiles.forEach(file => {
        simulateUpload(file);
      });
    }
  }, [currentFiles, field.multiple, field.maxFiles, validateFile, onChange, field.uploadUrl, simulateUpload]);

  // Handle file removal
  const handleFileRemove = useCallback((index: number) => {
    if (field.multiple) {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(null);
    }
  }, [currentFiles, field.multiple, onChange]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Generate file preview
  const renderFilePreview = useCallback((file: File, index: number) => {
    const isImage = file.type.startsWith('image/');
    const progress = uploadProgress[file.name];

    return (
      <div key={`${file.name}-${index}`} className="d-flex align-items-center p-2 border rounded mb-2">
        <div className="me-3">
          {isImage && field.showPreview ? (
            <div 
              className="bg-light rounded d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', overflow: 'hidden' }}
            >
              <Image size={20} className="text-muted" aria-label="Image preview placeholder" />
            </div>
          ) : (
            <FileEarmark size={24} className="text-muted" />
          )}
        </div>
        
        <div className="flex-grow-1">
          <div className="fw-semibold">{file.name}</div>
          <small className="text-muted">{formatFileSize(file.size)}</small>
          
          {progress !== undefined && progress < 100 && (
            <ProgressBar 
              now={progress} 
              className="mt-1"
              style={{ height: '4px' }}
              label={`${Math.round(progress)}%`}
            />
          )}
        </div>
        
        {!field.readOnly && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleFileRemove(index)}
            aria-label={`Remove ${file.name}`}
          >
            <X size={16} />
          </Button>
        )}
      </div>
    );
  }, [field.showPreview, field.readOnly, uploadProgress, formatFileSize, handleFileRemove]);

  return (
    <Form.Group className={groupClass} controlId={field.name}>
      <Form.Label className={labelClass}>
        {field.label}
        {!field.required && <span className="form-label-secondary">(Optional)</span>}
      </Form.Label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={field.multiple}
        accept={field.accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        onBlur={onBlur}
        style={{ display: 'none' }}
        disabled={field.readOnly}
      />

      {/* Drop zone */}
      <div
        className={`
          border-2 border-dashed rounded p-4 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}
          ${hasError ? 'border-danger' : ''}
          ${field.readOnly ? 'bg-light' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !field.readOnly && fileInputRef.current?.click()}
      >
        <CloudUpload size={32} className="text-muted mb-2" />
        <div className="mb-2">
          <strong>Drop files here</strong> or <span className="text-primary">browse</span>
        </div>
        
        <div className="small text-muted">
          {field.accept && (
            <div>Accepted types: {field.accept}</div>
          )}
          {field.maxSize && (
            <div>Max size: {formatFileSize(field.maxSize)}</div>
          )}
          {field.maxFiles && (
            <div>Max files: {field.maxFiles}</div>
          )}
        </div>
      </div>

      {/* File list */}
      {currentFiles.length > 0 && (
        <div className="mt-3">
          <div className="d-flex align-items-center mb-2">
            <span className="fw-semibold">Selected Files</span>
            <Badge bg="secondary" className="ms-2">{currentFiles.length}</Badge>
          </div>
          {currentFiles.map((file, index) => renderFilePreview(file, index))}
        </div>
      )}

      {field.helpText && (
        <Form.Text className="text-muted">{field.helpText}</Form.Text>
      )}
      
      {hasError && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </Form.Group>
  );
};

export default FileUploadField;
