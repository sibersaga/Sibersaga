import React, { useState, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
  tagName?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  multiline = false,
  className = '',
  tagName = 'span'
}) => {
  const { isEditMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  // Sync value if changed from outside
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const Tag = tagName;

  if (!isEditMode) {
    // Normal display
    return (
      <Tag className={className}>
        {value.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < value.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  if (isEditing) {
    return (
      <div className={`inline-block w-full min-w-[120px] relative z-20 bg-white p-2.5 rounded-xl border-2 border-orange-500 shadow-xl ${className}`}>
        <form onSubmit={handleSave} className="flex flex-col gap-2">
          {multiline ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[100px] p-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans"
              rows={4}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans"
              autoFocus
            />
          )}
          <div className="flex justify-end gap-1.5 text-[10px] font-black font-mono">
            <button
              type="button"
              onClick={handleCancel}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X size={10} />
              <span>BATAL</span>
            </button>
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Check size={10} />
              <span>SIMPAN</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`group relative cursor-pointer border-2 border-dashed border-sky-400 hover:border-orange-500 hover:bg-orange-50/20 rounded-lg transition-all duration-200 p-0.5 inline-block ${className}`}
      title="Klik untuk Mengedit Visual"
    >
      <Tag className="pr-5">
        {value.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < value.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </Tag>
      
      {/* Floating Edit Indicator Icon */}
      <span className="absolute top-1 right-1 p-0.5 bg-sky-500 group-hover:bg-orange-500 text-white rounded shadow-sm opacity-60 group-hover:opacity-100 transition-all">
        <Edit2 size={10} className="stroke-[2.5]" />
      </span>
    </div>
  );
};
