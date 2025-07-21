// components/TextEditor.js
import { memo, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ value, onChange, placeholder = 'Write here...', className = '' }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      editor.root.style.minHeight = '150px';
    }
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`rounded ${className}`}
      theme="snow"
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],           
          ['bold', 'italic', 'underline', 'strike'],       
          [{ color: [] }, { background: [] }],              
          [{ script: 'sub' }, { script: 'super' }],          
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],             
          [{ align: [] }],                                    
          ['clean'],                                        
        ],
      }}
      formats={[
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'blockquote', 'code-block',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'align',
      ]}
    />
  );
};

export default memo(TextEditor);
