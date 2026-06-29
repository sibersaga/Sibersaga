import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading1, 
  Heading2, 
  Heading3,
  Undo, 
  Redo, 
  Check, 
  X, 
  Sparkles,
  Palette,
  Eraser,
  Code
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface RichTextEditorProps {
  htmlValue: string;
  onSave: (newHtml: string) => void;
  className?: string;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  htmlValue,
  onSave,
  className = '',
  label = 'Konten Rich Text'
}) => {
  const { isEditMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const initialHtml = useRef(htmlValue);

  // Sync initialHtml when htmlValue updates from outside and we are not editing
  useEffect(() => {
    if (!isEditing) {
      initialHtml.current = htmlValue;
    }
  }, [htmlValue, isEditing]);

  const handleCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSave = () => {
    if (editorRef.current) {
      const cleanHtml = editorRef.current.innerHTML;
      onSave(cleanHtml);
      initialHtml.current = cleanHtml;
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isEditMode) {
    // Standard secure output
    return (
      <div 
        className={`prose prose-slate max-w-none text-slate-600 leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlValue }}
      />
    );
  }

  if (isEditing) {
    return (
      <div 
        className="w-full bg-white rounded-2xl border-2 border-orange-500 shadow-2xl overflow-hidden relative z-30 transition-all duration-300 animate-fade-in"
        id="rich-text-editor-container"
      >
        {/* Editor Toolbar */}
        <div className="bg-slate-900 text-slate-100 p-2 border-b border-slate-800 flex flex-wrap items-center gap-1 text-xs font-mono select-none">
          {/* Format buttons */}
          <button
            type="button"
            onClick={() => handleCommand('bold')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Tebal (Ctrl+B)"
          >
            <Bold size={14} className="stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('italic')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Miring (Ctrl+I)"
          >
            <Italic size={14} className="stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('underline')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Garis Bawah (Ctrl+U)"
          >
            <Underline size={14} className="stroke-[2.5]" />
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1" />

          {/* Heading levels */}
          <button
            type="button"
            onClick={() => handleCommand('formatBlock', '<h2>')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Heading Besar (H2)"
          >
            <Heading2 size={14} className="stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('formatBlock', '<h3>')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Heading Sedang (H3)"
          >
            <Heading3 size={14} className="stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('formatBlock', '<p>')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer font-black text-[10px]"
            title="Teks Paragraf Biasa"
          >
            <Code size={14} />
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => handleCommand('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Daftar Bullets"
          >
            <List size={14} className="stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('insertOrderedList')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Daftar Angka"
          >
            <ListOrdered size={14} className="stroke-[2.5]" />
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1" />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => handleCommand('justifyLeft')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Rata Kiri"
          >
            <AlignLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('justifyCenter')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Rata Tengah"
          >
            <AlignCenter size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('justifyRight')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Rata Kanan"
          >
            <AlignRight size={14} />
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1" />

          {/* Colors */}
          <button
            type="button"
            onClick={() => handleCommand('foreColor', '#f97316')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Warna Oranye"
          >
            <Palette size={14} className="text-orange-500 fill-orange-500" />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('foreColor', '#0284c7')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Warna Biru"
          >
            <Palette size={14} className="text-sky-500 fill-sky-500" />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('removeFormat')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Hapus Semua Format"
          >
            <Eraser size={14} />
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1 ml-auto" />

          {/* Undo/Redo */}
          <button
            type="button"
            onClick={() => handleCommand('undo')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Undo (Urungkan)"
          >
            <Undo size={12} />
          </button>
          <button
            type="button"
            onClick={() => handleCommand('redo')}
            className="p-1.5 hover:bg-slate-800 hover:text-orange-400 rounded transition-colors cursor-pointer"
            title="Redo"
          >
            <Redo size={12} />
          </button>
        </div>

        {/* Contenteditable area */}
        <div 
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className={`p-6 min-h-[220px] max-h-[500px] overflow-y-auto focus:outline-none bg-slate-50 text-slate-800 prose prose-slate max-w-none text-sm leading-relaxed ${className}`}
          dangerouslySetInnerHTML={{ __html: initialHtml.current }}
          id="rich-text-editable-area"
        />

        {/* Footer actions */}
        <div className="bg-slate-100 p-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] font-black font-mono">
          <span className="text-slate-500 uppercase tracking-widest pl-2">
            ✏️ Rich Text Editor Aktif
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X size={11} className="stroke-[2.5]" />
              <span>BATAL</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
            >
              <Check size={11} className="stroke-[2.5]" />
              <span>SIMPAN DATA</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode - Trigger visual banner
  return (
    <div 
      onClick={() => setIsEditing(true)}
      className="group relative cursor-pointer border-2 border-dashed border-sky-400 hover:border-orange-500 hover:bg-orange-50/10 rounded-2xl transition-all duration-200 p-4 w-full"
      title="Klik untuk mengedit visual dengan Rich Text Editor"
    >
      <div 
        className={`prose prose-slate max-w-none text-slate-600 leading-relaxed pr-6 ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlValue }}
      />
      
      {/* Absolute overlay badge on hover */}
      <div className="absolute top-3 right-3 p-1.5 bg-sky-500 group-hover:bg-orange-500 text-white rounded-xl shadow-lg opacity-60 group-hover:opacity-100 transition-all flex items-center gap-1 text-[9px] font-black font-mono tracking-widest uppercase">
        <Sparkles size={11} className="animate-spin" />
        <span>EDIT VISUAL WYSIWYG</span>
      </div>
    </div>
  );
};
