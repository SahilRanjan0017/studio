
"use client";

import type React from 'react';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { UploadCloud, FileImage, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (dataUrl: string, fileName: string) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [onImageUpload]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (e.g., JPG, PNG, GIF).",
        variant: "destructive",
      });
      setPreviewUrl(null);
      setFileName(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setFileName(file.name);
      onImageUpload(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [isLoading, onImageUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);


  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6">
      <label
        htmlFor="file-upload"
        className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-3" />
            <p className="text-lg font-semibold text-foreground">Analyzing...</p>
            <p className="text-sm text-muted-foreground">Please wait while we process your image.</p>
          </div>
        ) : previewUrl ? (
          <Image src={previewUrl} alt="Preview" layout="fill" objectFit="contain" className="rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloud className="w-10 h-10 mb-3 text-primary" />
            <p className="mb-2 text-sm text-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
        )}
        <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
      </label>

      {fileName && !isLoading && (
        <div className="text-sm text-muted-foreground flex items-center">
          <FileImage className="w-4 h-4 mr-2 text-primary" />
          Selected: {fileName}
        </div>
      )}
    </div>
  );
};
