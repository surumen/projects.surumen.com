import React, { useState, useEffect, useRef } from 'react';

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const editorRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [CKEditor, setCKEditor] = useState<any>(null);
  const [ClassicEditor, setClassicEditor] = useState<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      Promise.all([
        import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor),
        import('@ckeditor/ckeditor5-build-classic')
      ]).then(([CKEditorComponent, ClassicEditorModule]) => {
        setCKEditor(() => CKEditorComponent);
        setClassicEditor(() => ClassicEditorModule.default);
        setIsLoaded(true);
      }).catch(error => {
        console.error('Error loading CKEditor:', error);
      });
    }
  }, []);

  if (!isLoaded || !CKEditor || !ClassicEditor) {
    return (
      <div className="border rounded p-4 bg-light" style={{ minHeight: '300px' }}>
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="text-center">
            <div className="spinner-border mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-muted">Loading CKEditor...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={content}
        config={{
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              '|',
              'blockQuote',
              'insertTable',
              '|',
              'undo',
              'redo',
              '|',
              'sourceEditing'
            ]
          },
          placeholder: placeholder || 'Start writing your blog post...',
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableProperties',
              'tableCellProperties'
            ]
          },
          language: 'en',
          image: {
            toolbar: [
              'imageTextAlternative',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side'
            ]
          }
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
        onReady={(editor: any) => {
          editorRef.current = editor;
          console.log('CKEditor is ready!', editor);
        }}
        onBlur={(event: any, editor: any) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event: any, editor: any) => {
          console.log('Focus.', editor);
        }}
        onError={(error: any) => {
          console.error('CKEditor error:', error);
        }}
      />
    </div>
  );
}
