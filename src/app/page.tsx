
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Palette, Shirt, Sparkles, AlertCircle } from 'lucide-react';
import { analyzeStyle, type AnalyzeStyleOutput } from '@/ai/flows/analyze-style';
import { ImageUploader } from '@/components/image-uploader';
import { StyleAttributeCard } from '@/components/style-attribute-card';
import { ColorPaletteDisplay } from '@/components/color-palette-display';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeStyleOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (dataUrl: string, fileName: string) => {
    setUploadedImage(dataUrl);
    setUploadedImageName(fileName);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const result = await analyzeStyle({ photoDataUri: dataUrl });
      setAnalysisResult(result);
    } catch (e) {
      console.error("Style analysis failed:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during style analysis.";
      setError(`Failed to analyze image. ${errorMessage}`);
      toast({
        title: "Analysis Error",
        description: "Could not analyze the style of the image. Please try again or use a different image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setUploadedImageName(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
     // Reset file input in ImageUploader
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  // Add this useEffect to clear preview in ImageUploader if uploadedImage is null
  useEffect(() => {
    if (!uploadedImage) {
      const uploaderPreviewChild = document.querySelector('#file-upload + div > img');
      if (uploaderPreviewChild && uploaderPreviewChild.parentElement) {
         // This is a bit hacky, ideally ImageUploader would have a clearPreview prop
      }
    }
  }, [uploadedImage]);


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Discover Your <span className="text-primary">Style</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Upload an image and let our AI instantly analyze its color palette, clothing types, and overall aesthetic.
        </p>
      </div>

      <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />

      {uploadedImage && !isLoading && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={handleClear}>
            Upload Another Image
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-12">
        {isLoading && (
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && analysisResult && uploadedImage && (
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-2">Analysis Results for <span className="text-primary">{uploadedImageName}</span></h2>
              <div className="max-w-2xl mx-auto mt-4 mb-8 rounded-lg overflow-hidden shadow-2xl border border-border">
                <Image
                  src={uploadedImage}
                  alt="Uploaded style"
                  width={600}
                  height={600}
                  className="object-contain w-full max-h-[60vh]"
                  priority
                  data-ai-hint="fashion style"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              <StyleAttributeCard icon={<Palette className="w-6 h-6" />} title="Color Palette" animationDelay="0.1s">
                <ColorPaletteDisplay colors={analysisResult.colorPalette} />
              </StyleAttributeCard>

              <StyleAttributeCard icon={<Shirt className="w-6 h-6" />} title="Clothing Types" animationDelay="0.2s">
                {analysisResult.clothingTypes && analysisResult.clothingTypes.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {analysisResult.clothingTypes.map((type, index) => (
                      <li key={index} className="capitalize">{type}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific clothing types identified.</p>
                )}
              </StyleAttributeCard>

              <StyleAttributeCard icon={<Sparkles className="w-6 h-6" />} title="Overall Aesthetic" animationDelay="0.3s">
                {analysisResult.overallAesthetic ? (
                   <p className="text-sm leading-relaxed">{analysisResult.overallAesthetic}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No overall aesthetic described.</p>
                )}
              </StyleAttributeCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const CardSkeleton = () => (
  <div className="p-6 border bg-card rounded-lg shadow-sm">
    <div className="flex items-center mb-4">
      <Skeleton className="h-10 w-10 rounded-full mr-3" />
      <Skeleton className="h-6 w-3/4" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-2" />
    <Skeleton className="h-4 w-full" />
  </div>
);

