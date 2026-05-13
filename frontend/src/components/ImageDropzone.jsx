import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ImageDropzone — Drag-and-drop (or click-to-browse) image upload area.
 */
export default function ImageDropzone({ onImageSelect, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageSelect(files[0]);
    }
  }, [disabled, onImageSelect]);

  const handleClick = useCallback(() => {
    if (disabled) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files.length > 0) {
        onImageSelect(e.target.files[0]);
      }
    };
    input.click();
  }, [disabled, onImageSelect]);

  return (
    <motion.div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      className={`
        relative border-2 border-dashed rounded-lg p-6 cursor-pointer
        transition-colors duration-200 text-center
        ${isDragging
          ? 'border-accent-500 bg-accent-500/5'
          : 'border-surface-400 hover:border-surface-300 bg-surface-700/30'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex flex-col items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-500">
          <path d="M4 20l7-7 4 4 6-6 7 7" />
          <rect x="4" y="4" width="24" height="24" rx="2" />
          <circle cx="22" cy="10" r="2" />
        </svg>
        <p className="text-sm text-neutral-400">
          {isDragging ? 'Drop image here' : 'Click or drag image to upload'}
        </p>
        <p className="text-[10px] text-neutral-600">
          PNG, JPG, WEBP — Max 5MB
        </p>
      </div>
    </motion.div>
  );
}
