/**
 * useImageLoader — Handles image file upload, loading onto canvas, and pixel data extraction.
 */

import { useState, useRef, useCallback } from 'react';

const MAX_DIMENSION = 1024;

export function useImageLoader() {
  const [imageData, setImageData] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hiddenCanvasRef = useRef(null);

  /**
   * Load an image file, resize if necessary, and extract pixel data.
   */
  const loadImage = useCallback((file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setImageName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Resize if too large
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const scale = MAX_DIMENSION / Math.max(width, height);
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
        }

        // Create offscreen canvas to extract pixel data
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const pixelData = ctx.getImageData(0, 0, width, height);

        setImageData(pixelData);
        setImageDimensions({ width, height });
        setImagePreview(canvas.toDataURL('image/jpeg', 0.8));
        setIsLoading(false);

        // Store reference for later use
        hiddenCanvasRef.current = canvas;
      };

      img.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  }, []);

  /**
   * Load image from a URL (e.g., for demo images).
   */
  const loadFromURL = useCallback((url) => {
    setIsLoading(true);
    setError(null);
    setImageName(url.split('/').pop() || 'image');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let { width, height } = img;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const pixelData = ctx.getImageData(0, 0, width, height);

      setImageData(pixelData);
      setImageDimensions({ width, height });
      setImagePreview(canvas.toDataURL('image/jpeg', 0.8));
      setIsLoading(false);
      hiddenCanvasRef.current = canvas;
    };

    img.onerror = () => {
      setError('Failed to load image from URL');
      setIsLoading(false);
    };

    img.src = url;
  }, []);

  const reset = useCallback(() => {
    setImageData(null);
    setImageDimensions(null);
    setImageName('');
    setImagePreview(null);
    setError(null);
    hiddenCanvasRef.current = null;
  }, []);

  return {
    imageData,
    imageDimensions,
    imageName,
    imagePreview,
    isLoading,
    error,
    hiddenCanvasRef,
    loadImage,
    loadFromURL,
    reset,
  };
}
