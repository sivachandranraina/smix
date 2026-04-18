import React, { useState, useRef } from 'react';
import axios from 'axios';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onImageUploaded, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://127.0.0.1:8000/users/upload_photo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Pass the uploaded URL back to parent
      onImageUploaded(response.data.url);
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image. Please try again.');
      setPreview(currentImage || null); // Revert
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-slate-700 bg-slate-800 flex items-center justify-center cursor-pointer group hover:border-primary-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-12 h-12 text-slate-500 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
        
        {/* Overlay for hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-medium">{uploading ? 'Uploading...' : 'Change Photo'}</span>
        </div>
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
      />
      <p className="text-slate-400 text-xs mt-3">Upload a clear photo capturing your smile</p>
    </div>
  );
}
